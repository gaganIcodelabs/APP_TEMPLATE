import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useConfiguration } from '@context/configurationContext';
import debounce from 'lodash/debounce';

export interface LocationSuggestion {
  id: string;
  placeName: string;
  address: string;
  center: [number, number]; // [longitude, latitude]
  bbox?: [number, number, number, number]; // [minX, minY, maxX, maxY]
  placeType: string[];
}

export interface LocationModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectLocation: (location: LocationSuggestion) => void;
  initialValue?: string;
  placeholder?: string;
}

interface MapboxGeocodingResponse {
  type: string;
  query: string[];
  features: Array<{
    id: string;
    type: string;
    place_type: string[];
    relevance: number;
    properties: {
      [key: string]: any;
    };
    text: string;
    place_name: string;
    center: [number, number];
    bbox?: [number, number, number, number];
    geometry: {
      type: string;
      coordinates: [number, number];
    };
  }>;
}

const DEBOUNCE_WAIT_TIME = 300;
const MIN_SEARCH_LENGTH = 3;

const LocationModal: React.FC<LocationModalProps> = ({
  visible,
  onClose,
  onSelectLocation,
  initialValue = '',
  placeholder = 'Search for a location...',
}) => {
  const [searchText, setSearchText] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Get Mapbox configuration from context
  const config = useConfiguration();
  const {
    maps: { mapboxConfig, mapboxAccessToken } = {},
  } = config || {};

  // Fetch location suggestions from Mapbox API
  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query || query.length < MIN_SEARCH_LENGTH) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setIsLoading(true);
    setError(null);

    try {
      if (!mapboxAccessToken) {
        throw new Error('Mapbox access token is not configured');
      }

      if (!mapboxConfig) {
        throw new Error('Mapbox configuration is not available');
      }

      const { GEOCODING_PLACES_BASE_URL, limit, language } = mapboxConfig;

      // Encode the query for URL
      const encodedQuery = encodeURIComponent(query);
      const url = `${GEOCODING_PLACES_BASE_URL}/${encodedQuery}.json?limit=${limit}&language=${language}&access_token=${mapboxAccessToken}`;

      const response = await fetch(url, { signal });

      if (!response.ok) {
        throw new Error(`Mapbox API error: ${response.status} ${response.statusText}`);
      }

      const data: MapboxGeocodingResponse = await response.json();

      // Transform Mapbox response to our LocationSuggestion format
      const transformedSuggestions: LocationSuggestion[] = data.features.map(feature => ({
        id: feature.id,
        placeName: feature.place_name,
        address: feature.place_name,
        center: feature.center,
        bbox: feature.bbox,
        placeType: feature.place_type,
      }));

      setSuggestions(transformedSuggestions);
    } catch (err: any) {
      // Ignore abort errors
      if (err.name === 'AbortError') {
        return;
      }

      console.error('Error fetching location suggestions:', err);
      setError(err.message || 'Failed to fetch location suggestions');
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, [mapboxAccessToken, mapboxConfig]);

  // Debounced version of fetchSuggestions
  const debouncedFetchSuggestions = useMemo(
    () => debounce(fetchSuggestions, DEBOUNCE_WAIT_TIME),
    [fetchSuggestions],
  );

  // Handle text input change
  const handleTextChange = useCallback(
    (text: string) => {
      setSearchText(text);
      setError(null);

      if (text.length >= MIN_SEARCH_LENGTH) {
        debouncedFetchSuggestions(text);
      } else {
        setSuggestions([]);
        setIsLoading(false);
      }
    },
    [debouncedFetchSuggestions],
  );

  // Handle location selection
  const handleSelectLocation = useCallback(
    (location: LocationSuggestion) => {
      onSelectLocation(location);
      setSearchText(location.placeName);
      // setSuggestions([]);
      onClose();
    },
    [onSelectLocation, onClose],
  );

  // Cleanup on unmount or when modal closes
  useEffect(() => {
    if (!visible) {
      // Cancel any pending requests
      // if (abortControllerRef.current) {
      //   abortControllerRef.current.abort();
      // }
      // setSuggestions([]);
      // setError(null);
      // setIsLoading(false);
    }
  }, [visible]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedFetchSuggestions.cancel();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedFetchSuggestions]);

  const renderSuggestionItem = useCallback(
    ({ item }: { item: LocationSuggestion }) => (
      <TouchableOpacity
        style={styles.suggestionItem}
        onPress={() => handleSelectLocation(item)}
        activeOpacity={0.7}
      >
        <Text style={styles.suggestionText}>{item.placeName}</Text>
      </TouchableOpacity>
    ),
    [handleSelectLocation],
  );

  const onModalShow = () => {
    // handleTextChange(searchText);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
      onShow={onModalShow}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Select Location</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Search Input */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder={placeholder}
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={handleTextChange}
              autoFocus={true}
              returnKeyType="search"
            />
            {isLoading && (
              <View style={styles.loadingIndicator}>
                <ActivityIndicator size="small" color="#007AFF" />
              </View>
            )}
          </View>

          {/* Error Message */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Suggestions List */}
          {suggestions.length > 0 && (
            <FlatList
              data={suggestions}
              renderItem={renderSuggestionItem}
              keyExtractor={item => item.id}
              style={styles.suggestionsList}
              keyboardShouldPersistTaps="handled"
            />
          )}

          {/* Empty State */}
          {!isLoading &&
            !error &&
            searchText.length >= MIN_SEARCH_LENGTH &&
            suggestions.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No locations found</Text>
              </View>
            )}

          {/* Hint Text */}
          {searchText.length < MIN_SEARCH_LENGTH && searchText.length > 0 && (
            <View style={styles.hintContainer}>
              <Text style={styles.hintText}>
                Type at least {MIN_SEARCH_LENGTH} characters to search
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  searchInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#F9F9F9',
  },
  loadingIndicator: {
    marginLeft: 12,
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#FFEBEE',
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
  },
  errorText: {
    color: '#C62828',
    fontSize: 14,
  },
  suggestionsList: {
    maxHeight: 400,
  },
  suggestionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  suggestionText: {
    fontSize: 16,
    color: '#333',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  hintContainer: {
    padding: 16,
    alignItems: 'center',
  },
  hintText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
});

export default LocationModal;
