---
title: "Replacing Loops With Pipelines"
excerpt: "Complex loops can be simplified by using 'Pipelines'."
---

One of the refactorings I’ve been using a lot lately is “[Replace Loop with Pipeline](https://www.refactoring.com/catalog/replaceLoopWithPipeline.html)”, which is described in the the book Refactoring.

Let’s see a couple of examples:

## 1. A simple `forEach` loop

Imagine you have a loop that performs several processing operations (filtering, transforming elements, sorting, etc) on the collection being iterated. Something like the following `forEach` loop:

```js
  const products = [ ... ];
  const filteredProductsWithDiscount = [];

  products.forEach((product) => {
    if (product.price > 50) {
      filteredProductsWithDiscount.push({
        name: product.name,
        price: product.price * 0.9
      });
    }
  });

  filteredProductsWithDiscount.sort((a, b) => a.price - b.price);
```

This code is generating a new collection of products by:

- filtering products that cost more than 50 (filtering)
- applying a 9% discount applied to each of them (mapping)
- sorting them by descending price (sorting)

Easy, right?

Let’s see how we can can replace this loop with a “pipeline”.

According to [Wikipedia](<https://en.wikipedia.org/wiki/Pipeline_(software)>):

> In software engineering, a pipeline consists of a chain of processing elements (processes, threads, coroutines, functions, etc.), arranged so that the output of each element is the input of the next.

Instead of processing one element at a time, this refactoring suggests sequencing operations that are applied to the entire collection every time.

### Filtering

We start by extracting the filtering piece from the loop using `Array.prototype.filter()`:

```js
const products = [...];
const filteredProductsWithDiscount = [];

products
  .filter(product => product.price > 50) <--- this
  .forEach(product => {
    filteredProductsWithDiscount.push({
      name: product.name,
      price: product.price * 0.9
    })
  })

filteredProductsWithDiscount.sort((a, b) => a.price - b.price);
```

### Mapping

Now we can get rid of the `forEach` using `Array.prototype.map()`:

```js
const products = [...];
const filteredProductsWithDiscount = products
  .filter(product => product.price > 50)
  .map(product => ({ <--- this
    name: product.name,
    price: product.price * 0.9
  )});

filteredProductsWithDiscount.sort((a, b) => a.price - b.price);
```

### Sorting

Finally, we can append the sorting to the pipeline:

```js
const products = [...];
const filteredProductsWithDiscount = products
  .filter(product => product.price > 50)
  .map(product => ({
    name: product.name,
    price: product.price * 0.9
  )})
  .sort((a, b) => a.price - b.price); <--- this
```

Doesn't it read much better?

We can even go a step further and extract functions for each of the callbacks:

```js
const products = [...];

const filteredProductsWithDiscount = products
  .filter(isExpensive)
  .map(applyDiscount)
  .sort(sortByPrice);

function isExpensive(product) {
  return product.price > 50;
}

function applyDiscount(product) {
  return {
    name: product.name,
    price: product.price * 0.9
  };
}

function sortByPrice(a, b) {
  return a.price - b.price;
}
```

This makes the code easier to read and we might be able to reuse some of those functions for other purposes!

## 2. A real world `reduce` loop example

I don’t know about you, but I often have a hard time understanding `reduce` loops `😅.`

The good news is that this refactoring can help with reduces too.

Here’s a real world example I just found:

```js
Object.values(filters).reduce((result, filter) => {
  if (filter.config.values.length > 1) {
    result[filter.config.id] = filter;
  }
  return result;
}, {});
```

And the refactored version:

```
Object.fromEntries(
  Object.values(filters)
    .filter(filter => filter.config.values.length > 1)
    .map(filter => [filter.config.id, filter])
)
```

Isn’t it way easier to understand too?

## Conclusion

These two examples are kind of trivial, but you get the idea 🙂

I encourage you to now go find some nasty loops in the codebase you’re working on and give this refactoring a try! You’ll be surprised how much better your code will read!
