---
title: "Moving Away From Boolean Parameters"
excerpt: "Boolean parameters suck. I'll explain you why. There's a better alternative."
---

Do you still use boolean parameters in your functions or methods?

There’s already a lot of content out there explaining why they are not a good practice and what’s the alternative. If you’ve read [Clean Code](https://www.goodreads.com/book/show/3735293-clean-code), you probably know what I’m talking about.

But, since I keep bumping into boolean parameters, I thought I’d write another post about them, hoping to help you understand this “code smell” and how to fix it.

## Why boolean parameters are not good

Imagine you’re reading the following statements in different parts of a codebase:

```js
// In one place...
processOrder(orderId, true);

// In a different place...
processOrder(orderId, false);
```

It's clear that we're processing the order identified by `orderId` in both cases, but **can you easily tell the difference between passing** `true` **or** `false` **as the second argument**?

No, right?

Well, this is the issue with boolean parameters: You would have to look into the function’s signature (and sometimes the body) to understand what that second parameter is for.

```js
export function processOrder(orderId, isExpress) {
  // ...
}
```

Aha! Now it’s more clear: `isExpress` allows some sort of express processing.

As you can see, **the purpose of a boolean parameter might be clear in the context of a function or method definition, but it’s not so obvious when looking at a function or method call, forcing us to look into the actual implementation of the function or method to understand its intent.**

It makes reading code a little bit harder.

## A better alternative

What’s a better alternative for people reading the code?

Well, here it is:

```js
// Going from this:
processOrder(orderId, false);
processOrder(orderId, true);

// To this:
processStandardOrder(orderId);
processExpressOrder(orderId);
```

Take a moment to look at the new function calls.

Do you think you would now be able to tell the difference between both calls without looking into actual implementation of the functions?

Hell yeah!

The function names are pretty self-explanatory now: one function processes a standard order, the other one process a express order.

## How to move away from boolean parameters

As an example, we’ll be using a pretty “dumb” implementation of the `processOrder` function that only logs stuff to the console:

```js
function processOrder(orderId, isExpress) {
  console.log(`Processing order #${orderId}`);

  // Conditional action based on boolean parameter
  if (isExpress) {
    console.log("This is an express order.");
  } else {
    console.log("This is a standard order.");
  }

  console.log("Order processed.");
}
```

As you can see, the function does something before and after the actual “processing” of the order, which depends on the value of the `isExpress` parameter.

Let’s see how we can make our code a bit easier to read by getting rid of the `isExpress` boolean parameter 😀

### 1\. Create two new functions with meaningful names and no boolean parameter

```js
export function processExpressOrder(orderId) {
  processOrder(orderId, true);
}

export function processStandardOrder(orderId) {
  processOrder(orderId, false);
}

export function processOrder(orderId, isExpress) {
  // ...
}
```

The two new functions use the original one and still, nobody is using them.

### 2\. Find and replace existing calls with calls to the new functions

We now have to use the new functions everywhere (expect inside of the new functions) by doing some “find and replace”:

- `processOrder(orderId, false)` 👉 `processStandardOrder(orderId)`
- `processOrder(orderId, true)` 👉 `processExpressOrder(orderId)`

### 3\. Make the original function “private”

Since we don’t want others to use the original function with the boolean parameter anymore, we can make it “private” (eg: by not exporting it).

```js
export function processExpressOrder(orderId) {
  processOrder(orderId, true);
}

export function processStandardOrder(orderId) {
  processOrder(orderId, false);
}

// This function is no longer being exported
function processOrder(orderId, isExpress) {
  // ...
}
```

### 4\. Refactor the original function

Now the “outside world” doesn’t need to deal with the boolean parameter anymore, but we still have a function with a boolean parameter. To get rid of it completely, we can replace the if statement in the original function with a call to a new `action` parameter.

```js
export function processExpressOrder(orderId) {
  processOrder(orderId, () => {
    console.log("This is an express order.");
  });
}

export function processStandardOrder(orderId) {
  processOrder(orderId, () => {
    console.log("This is a standard order.");
  });
}

function processOrder(orderId, action) {
  console.log(`Processing order #${orderId}`);

  action(); // <-- the function now accepts an "action"

  console.log("Order processed.");
}
```

As a side effect, the design of our code is better now ✨. It’d be really easy to implement new types of processing without having to change the `processOrder` function. For example, if we wanted to process “pickup” orders, we could easily implement a new function:

```js
export function processPickupOrder(orderId) {
  processOrder(orderId, () => {
    console.log("This is a pickup order.");
  });
}
```

## Conclusion

I hope this post provided you with compelling reasons to avoid boolean parameters and introduced you to a more readable alternative, benefiting both other developers and your future self.

I used a JS function as an example but the same applies to methods in classes and to any other language out there.

Now, go find a function with a boolean parameter and make your code a little bit cleaner by practicing this technique! 💪
