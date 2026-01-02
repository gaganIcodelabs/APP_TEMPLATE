# SelectListingCategory Component

A multi-level category selector component that supports up to 3 levels of nested categories using the `RadioList` component.

## Features

- **Multi-level Navigation**: Supports categories with up to 2 levels of subcategories (3 levels total)
- **Breadcrumb Navigation**: Shows the selected path and allows users to go back to previous levels
- **Progressive Disclosure**: Only shows the next level of categories after selecting from the current level
- **React Hook Form Integration**: Fully integrated with react-hook-form's Controller
- **Visual Feedback**: Shows final selection with highlighted styling
- **Conditional Rendering**: Only displays when listing type is selected and compatible with currency

## Category Structure

Categories follow a recursive structure defined by `CategoryNode`:

```typescript
interface CategoryNode {
  name: string;
  id: string;
  subcategories: CategoryNode[];
}
```

### Example Category Configuration

```javascript
{
  categories: [
    {
      name: 'Electronics',
      id: 'electronics',
      subcategories: [
        {
          name: 'Computers',
          id: 'computers',
          subcategories: [
            { name: 'Laptops', id: 'laptops', subcategories: [] },
            { name: 'Desktops', id: 'desktops', subcategories: [] }
          ]
        },
        {
          name: 'Phones',
          id: 'phones',
          subcategories: [
            { name: 'Smartphones', id: 'smartphones', subcategories: [] },
            { name: 'Feature Phones', id: 'feature-phones', subcategories: [] }
          ]
        }
      ]
    },
    {
      name: 'Furniture',
      id: 'furniture',
      subcategories: [
        { name: 'Living Room', id: 'living-room', subcategories: [] },
        { name: 'Bedroom', id: 'bedroom', subcategories: [] }
      ]
    }
  ]
}
```

## Usage

```tsx
import { useForm } from 'react-hook-form';
import SelectListingCategory from './components/SelectListingCategory';

const EditListing = () => {
  const { control } = useForm();

  return (
    <SelectListingCategory
      control={control}
      listingId={listingId}
      watch={watch}
    />
  );
};
```

## User Flow

### Level 1: Top-level Categories
User sees all top-level categories (e.g., Electronics, Furniture)

```
Select Category
○ Electronics
○ Furniture
○ Clothing
```

### Level 2: Subcategories
After selecting "Electronics", user sees its subcategories

```
Breadcrumb: Electronics >

Select Subcategory
○ Computers
○ Phones
○ Tablets
```

### Level 3: Sub-subcategories
After selecting "Computers", user sees its sub-subcategories

```
Breadcrumb: Electronics > Computers >

Select Sub-subcategory
○ Laptops
○ Desktops
○ Monitors
```

### Final Selection
After selecting "Laptops" (or if no more subcategories exist)

```
Breadcrumb: Electronics > Computers > Laptops

✓ Selected Category:
  Laptops
```

## Navigation Features

### Breadcrumb Navigation
- Click on any level in the breadcrumb to go back
- Clicking "Electronics" in "Electronics > Computers > Laptops" will reset to Level 1
- Clicking "Computers" will reset to Level 2

### Progressive Disclosure
- Only one level is shown at a time
- Next level appears only after selection
- Previous selections are shown in breadcrumb

## Integration with Form

The component uses React Hook Form's `Controller` to manage the form state:

```tsx
<Controller
  control={control}
  name="category"
  render={({ field: { onChange }, fieldState: { error } }) => {
    // Component renders category selection UI
    // Calls onChange with the final selected category ID
  }}
/>
```

The form value (`category` field) will contain the ID of the deepest selected category:
- If user selects: Electronics > Computers > Laptops
- Form value: `"laptops"`

## Conditional Rendering

The component only renders when:
1. `listingType` is selected
2. Categories are available in config
3. Selected listing type's transaction process is compatible with the currency

```typescript
if (!listingType || !hasCategories || !isCompatibleCurrency) return null;
```

## Styling

The component includes several styled sections:

### Breadcrumb
- Light gray background
- Blue text for clickable items
- Gray text for separators (>)
- Dark text for current (non-clickable) item

### Final Selection Box
- Green background with left border
- Shows "Selected Category:" label
- Bold category name

### Error Display
- Red text below the component
- Shown when form validation fails

## Props

| Prop | Type | Description |
|------|------|-------------|
| `control` | `Control<EditListingFormType>` | React Hook Form control object |
| `listingId` | `string` | ID of the listing being edited (optional for new listings) |
| `watch` | `UseFormWatch` | React Hook Form watch function |

## State Management

### Local State
- `categorySelection`: Tracks selections at each level (level1, level2, level3)
- `formOnChange`: Stores the react-hook-form onChange handler

### Derived State
- `finalSelectedCategory`: The deepest selected category ID
- `level1Categories`, `level2Categories`, `level3Categories`: Available options for each level
- `showLevel2`, `showLevel3`: Boolean flags for conditional rendering

## Helper Functions

### `findCategoryById(categories, id)`
Recursively searches the category tree to find a category by ID

### `getSubcategoriesForLevel(level)`
Returns available subcategories for a given level based on current selections

### `handleCategorySelect(level, categoryId)`
Handles selection at a specific level and updates form value

### `handleGoBackToLevel(level)`
Resets selection to a previous level (used by breadcrumb navigation)

### `getCategoryName(categoryId)`
Gets the display name for a category ID

## Example Scenarios

### Scenario 1: Category with No Subcategories
```
User selects: "Furniture"
Result: Shows final selection immediately (no subcategories)
Form value: "furniture"
```

### Scenario 2: Category with One Level of Subcategories
```
User selects: "Furniture" > "Living Room"
Result: Shows final selection (no sub-subcategories)
Form value: "living-room"
```

### Scenario 3: Category with Two Levels of Subcategories
```
User selects: "Electronics" > "Computers" > "Laptops"
Result: Shows final selection (deepest level reached)
Form value: "laptops"
```

### Scenario 4: Going Back
```
Current: "Electronics" > "Computers" > "Laptops"
User clicks "Electronics" in breadcrumb
Result: Resets to Level 1, shows all top-level categories
Form value: undefined (until new selection made)
```

## Dependencies

- `@components/RadioList`: For rendering radio button lists
- `react-hook-form`: For form state management
- `@context/configurationContext`: For accessing category configuration
- `@util/fieldHelpers`: For currency validation

## Notes

- Maximum depth is 3 levels (category > subcategory > sub-subcategory)
- The component automatically handles clearing lower levels when a higher level changes
- Form value is only set when a final selection is made (no more subcategories available)
- Breadcrumb allows easy navigation back to any previous level

