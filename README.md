# Spicemark

Syntax for documenting recipes

## What is spicemark?

Spicemark is a superset of the [Markdown](https://www.markdownguide.org/) language with specific decorators which allow processors to extract useful recipe information.

Spicemark uses a recipe method which has been "spiced up" by decorators to identify key elements so that a processor can generate an ingredient and quantity list, equipment list and process times.

## Decorators

All valid markdown is valid spicemark. To specify a spicemark decorator, wrap the word in a brace followed by a percentage sign. You use the inverse to indicate the end of the decorator.

For example:

```
{% this content is processed in spicemark %}
```

All decorators follow the same pattern:

- open decorator
- type identifier (ingredient, cookware, etc)
- the actual recipe text
- an optional pipe character `|` followed by a measurement, including quantity e.g. (150ml, 2cups)
- close decorator

```
{%i bread flour | 200g %}
```

### Ingredients

Indicate ingredients in your recipes by beginning the decorator with a lowercase `i`. The value after the pipe is the measurement.

```
{%i carrots | 2 %}
```

### Cookware

Indicate cookware by beginning the decorator with a lowercase `c`.

```
{%c frying pan %}
```

### Timings

Indicate times with a lowercase `t`.

```
{%t 5 minutes %}
```

### Optional timings

Recipes often describe ranges since timings vary by produce and equipment.
Indicate time ranges by placing a pipe character `|` between the time ranges.

```
{%t 30 minutes | 1 hour %}
```

## Modifiers & Associations

Spicemark recipe ingest and export should be easy. Many recipes written in the English language may separate items. These are the purpose of modifiers and associators. They allow you to describe recipes without making major modifications to your methods.

## Associations

If a single ingredient, cookware or timing is broken up, use a unique number or word right after the identifier to associate them. Ingredients and Cookware second argument (the entry after the pipe character) is measurement. Use `m` to indicate measurement.

```
Add a {%m1 small pinch %} of {%i1 sea salt %}.
```

Here, `1` is the unique identifier. "small pinch" is the measurement and "sea salt" is the ingredient.
You can also use associations to retain the same sentence structure.

```
Heat up {%m4 2 %} {%c4 skillets %}.
```

Here, `4` is the unique identifier. "2" is the measurement and "skillets" is the cookware.

## Modifiers

### Optional Ingredients

Some recipes may indicate multiple ingredient substitutes. Indicate substitutes with the question mark `?` followed by a unique identifier. Unique identifiers for optional ingredients need only be unique to other optional ingredients.

```
Add {%m1?1 300ml %} of {%i1?1 water %} or {%m2?1 100ml %} cooled and sieved {%i2?1 stock %}
```

Here there are 2 associators and 1 substitution.
`{%m1?1 300ml %}` and `{%1?1 water %}` are related.

- `m1` indicates this block contains the measurement for ingredient 1 (water)
- `?1` indicates that the ingredient is part of option group 1
  `%m2?1 100ml %}` and `{%i2?1 stock %}` are related.
- `m2` indicates this block contains the measurement for ingredient 2 (stock)
- `?1` indicates that the ingredient is part of option group 1

This kind of markup should yield an ingredient item of:

- Water _300ml_ or Stock _100ml_

### Ingredient Meta

Some ingredients might need additional description in an ingredient list, but could be referred to by another name in the recipe method. You can provide this context in your markup by adding an additional pipe to the ingredient decorator followed by your description.

```
Stir in the {%i mustard | 2 teaspoons | English %}
```

This kind of markup should yield an ingredient item of:

- Mustard _2 teaspoons_ (English)
