import { Listing } from '@appTypes/index';
import { CategoryNode } from '@appTypes/config/config';
import { RadioList } from '@components/index';
import { useConfiguration } from '@context/configurationContext';
import { useTypedSelector } from '@redux/store';
import { isValidCurrencyForTransactionProcess } from '@util/fieldHelpers';
import { useMemo, useState } from 'react';
import { Controller, useWatch } from 'react-hook-form';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { EditListingFormType } from '../types/editListingForm.type';

interface CategorySelection {
  level1?: string;
  level2?: string;
  level3?: string;
}

interface CategorySelectorContentProps {
  listingCategories: CategoryNode[];
  onChange: (value: string) => void;
  error?: { message?: string };
}

// Internal component that handles all category selection logic and UI
const CategorySelectorContent = ({
  listingCategories,
  onChange,
  error,
}: CategorySelectorContentProps) => {
  // Local state for tracking category selections at each level
  const [categorySelection, setCategorySelection] = useState<CategorySelection>({});

  // Find category by ID in the category tree
  const findCategoryById = (
    categories: CategoryNode[],
    id: string,
  ): CategoryNode | undefined => {
    for (const category of categories) {
      if (category.id === id) return category;
      if (category.subcategories?.length > 0) {
        const found = findCategoryById(category.subcategories, id);
        if (found) return found;
      }
    }
    return undefined;
  };

  // Get available subcategories based on current selection
  const getSubcategoriesForLevel = (level: 1 | 2 | 3): CategoryNode[] => {
    if (level === 1) {
      // Level 1: Return top-level categories
      return listingCategories;
    } else if (level === 2 && categorySelection.level1) {
      // Level 2: Return subcategories of selected level1
      const parentCategory = findCategoryById(
        listingCategories,
        categorySelection.level1,
      );
      return parentCategory?.subcategories || [];
    } else if (level === 3 && categorySelection.level2) {
      // Level 3: Return subcategories of selected level2
      const level1Category = findCategoryById(
        listingCategories,
        categorySelection.level1!,
      );
      if (level1Category?.subcategories) {
        const level2Category = findCategoryById(
          level1Category.subcategories,
          categorySelection.level2,
        );
        return level2Category?.subcategories || [];
      }
    }
    return [];
  };

  // Handle category selection at a specific level
  const handleCategorySelect = (level: 1 | 2 | 3, categoryId: string) => {
    const newSelection = { ...categorySelection };

    if (level === 1) {
      newSelection.level1 = categoryId;
      // Clear lower levels when selecting a new level1
      delete newSelection.level2;
      delete newSelection.level3;
    } else if (level === 2) {
      newSelection.level2 = categoryId;
      // Clear level3 when selecting a new level2
      delete newSelection.level3;
    } else if (level === 3) {
      newSelection.level3 = categoryId;
    }

    setCategorySelection(newSelection);

    // Update form value immediately
    const finalCategory = newSelection.level3 || newSelection.level2 || newSelection.level1;
    if (finalCategory) {
      onChange(finalCategory);
    }
  };

  // Handle going back to a previous level
  const handleGoBackToLevel = (level: 1 | 2) => {
    const newSelection = { ...categorySelection };

    if (level === 1) {
      delete newSelection.level1;
      delete newSelection.level2;
      delete newSelection.level3;
    } else if (level === 2) {
      delete newSelection.level2;
      delete newSelection.level3;
    }

    setCategorySelection(newSelection);
  };

  // Get the currently selected category name for display
  const getCategoryName = (categoryId: string): string => {
    const category = findCategoryById(listingCategories, categoryId);
    return category?.name || categoryId;
  };

  // Determine the final selected category (deepest level)
  const finalSelectedCategory =
    categorySelection.level3 || categorySelection.level2 || categorySelection.level1;

  // Get available options for current level
  const level1Categories = getSubcategoriesForLevel(1);
  const level2Categories = categorySelection.level1 ? getSubcategoriesForLevel(2) : [];
  const level3Categories = categorySelection.level2 ? getSubcategoriesForLevel(3) : [];

  const showLevel2 = level2Categories.length > 0;
  const showLevel3 = level3Categories.length > 0;

  return (
    <View style={styles.container}>
      {/* Breadcrumb showing selected path */}
      {categorySelection.level1 && (
        <View style={styles.breadcrumb}>
          <TouchableOpacity
            onPress={() => handleGoBackToLevel(1)}
            style={styles.breadcrumbItem}
          >
            <Text style={styles.breadcrumbText}>
              {getCategoryName(categorySelection.level1)}
            </Text>
            {(categorySelection.level2 || categorySelection.level3) && (
              <Text style={styles.breadcrumbSeparator}> &gt; </Text>
            )}
          </TouchableOpacity>

          {categorySelection.level2 && (
            <TouchableOpacity
              onPress={() => handleGoBackToLevel(2)}
              style={styles.breadcrumbItem}
            >
              <Text style={styles.breadcrumbText}>
                {getCategoryName(categorySelection.level2)}
              </Text>
              {categorySelection.level3 && (
                <Text style={styles.breadcrumbSeparator}> &gt; </Text>
              )}
            </TouchableOpacity>
          )}

          {categorySelection.level3 && (
            <View style={styles.breadcrumbItem}>
              <Text style={[styles.breadcrumbText, styles.breadcrumbActive]}>
                {getCategoryName(categorySelection.level3)}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Level 1: Top-level categories */}
      {!categorySelection.level1 && (
        <RadioList
          label="Select Category"
          options={level1Categories.map(cat => ({
            label: cat.name,
            value: cat.id,
          }))}
          value={categorySelection.level1}
          onChange={(id) => handleCategorySelect(1, id)}
        />
      )}

      {/* Level 2: Subcategories */}
      {categorySelection.level1 && showLevel2 && !categorySelection.level2 && (
        <RadioList
          label="Select Subcategory"
          options={level2Categories.map(cat => ({
            label: cat.name,
            value: cat.id,
          }))}
          value={categorySelection.level2}
          onChange={(id) => handleCategorySelect(2, id)}
        />
      )}

      {/* Level 3: Sub-subcategories */}
      {categorySelection.level2 && showLevel3 && !categorySelection.level3 && (
        <RadioList
          label="Select Sub-subcategory"
          options={level3Categories.map(cat => ({
            label: cat.name,
            value: cat.id,
          }))}
          value={categorySelection.level3}
          onChange={(id) => handleCategorySelect(3, id)}
        />
      )}

      {/* Show final selection or message if no more subcategories */}
      {((categorySelection.level1 && !showLevel2) ||
        (categorySelection.level2 && !showLevel3) ||
        categorySelection.level3) && (
        <View style={styles.finalSelection}>
          <Text style={styles.finalSelectionLabel}>Selected Category:</Text>
          <Text style={styles.finalSelectionValue}>
            {getCategoryName(finalSelectedCategory!)}
          </Text>
        </View>
      )}

      {/* Error message */}
      {error && <Text style={styles.errorText}>{error.message}</Text>}
    </View>
  );
};

// Main component that handles validation and wraps with Controller
const SelectListingCategory = ({
  control,
  listingId,
}: {
  control: any;
  watch: any;
  listingId: string;
}) => {
  const config = useConfiguration();

  const listingType = useWatch<EditListingFormType>({ control, name: 'type' });

  const transactionProcessAlias = useMemo(() => {
    return config?.listing?.listingTypes?.find(
      type => type.listingType === listingType,
    )?.transactionType.alias;
  }, [config, listingType]);

  const listingCurrency = useTypedSelector(state =>
    listingId
      ? (state.marketplaceData[listingId] as Listing)?.attributes?.price
          ?.currency
      : undefined,
  );

  // Determine the currency to validate:
  // - If editing an existing listing, use the listing's currency.
  // - If creating a new listing, fall back to the default marketplace currency.
  const currencyToCheck = listingCurrency || config.currency;

  // Verify if the selected listing type's transaction process supports the chosen currency.
  // This checks compatibility between the transaction process
  // and the marketplace or listing currency.
  const isCompatibleCurrency = isValidCurrencyForTransactionProcess(
    transactionProcessAlias,
    currencyToCheck,
  );

  const listingCategories = useMemo(() => {
    return config?.categoryConfiguration?.categories ?? [];
  }, [config]);

  const hasCategories = listingCategories && listingCategories.length > 0;

  if (!listingType || !hasCategories || !isCompatibleCurrency) return null;

  return (
    <Controller
      control={control}
      name="category"
      render={({ field: { onChange }, fieldState: { error } }) => (
        <CategorySelectorContent
          listingCategories={listingCategories}
          onChange={onChange}
          error={error}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  breadcrumb: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  breadcrumbItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breadcrumbText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  breadcrumbActive: {
    color: '#333',
  },
  breadcrumbSeparator: {
    fontSize: 14,
    color: '#999',
    marginHorizontal: 4,
  },
  finalSelection: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  finalSelectionLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  finalSelectionValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 8,
  },
});

export default SelectListingCategory;
