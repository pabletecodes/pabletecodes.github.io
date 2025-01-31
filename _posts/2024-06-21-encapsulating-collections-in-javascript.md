---
title: "Encapsulating Collections in Javascript"
excerpt: "Learn about the 'Encapsulated collection' refactoring and how you can implement it in JavaScript."
---

Imagine you have the following class:

```js
class Team {
  constructor(members) {
    this._members = members;
  }

  get members() {
    return this._members;
  }

  set members(members) {
    this._members = members;
  }
}
```

In your code, you could interact with this class like this:

```js
const team = new Team([mike, john]);

// Add a member
team.members.push(peter);

// Remove a member
const index = team.members.indexOf(peter);
team.members.splice(index, 1);

// Replace the members
team.members = [mike, john, peter];

// Get the number of members
console.log(team.members.length);

// Iterate through the members
for (let member of team.members) {
  console.log(member.fullname);
}
```

As you can see, in order to add or remove members to or from the team, the `Team` class is exposing a reference to it’s internal \_members array (through the members getter).

This clearly “breaks encapsulation” 😢

Users of the `Team` class:

1. Need to know about the class’s internal state (eg: the fact that it’s an array),

2. Can change the class’s internal state directly from the outside.

Let’s see how we can fix this.

## Enter the “Encapsulate Collection” refactoring

The [Encapsulate Collection refactoring](https://refactoring.com/catalog/encapsulateCollection.html) helps with this very exact issue. We can hide the internal \_members collection by adding a couple of new methods to manipulate it:

```js
class Team {
  constructor(members) {
    // We store a "copy" of the collection
    this.\_members = members.slice();
  }

  addMember(member) {
    return this.\_members.push(peter);
  }

  removeMember(member) {
    const index = this.\_members.indexOf(member);
    return this.\_members.splice(index, 1);
  }

  set members(members) {
    this.\_members = members.slice();
  }
}
```

Now, in order to add, remove, or replace the list of members, users of the Team class no longer need to know about the internal \_members collection:

```js
// Add a member
team.addMember(peter);

// Remove a member
team.removeMember(peter);

// Replace the members
team.members = [mike, john, peter];
```

Isn’t it great?

Well, there’re a couple of issues… we still need / want to:

1. know the number of members of a team, and

2. iterate through them.

This is the code that we wish we had:

```js
// Get the number of members
console.log(team.length);

// Iterate through the members
for (let member of team) {
  console.log(member.fullname);
}
```

As you can imagine, this doesn’t work:

- `Team` doesn’t have a length property or getter 😢.

- `Team` is not iterable 😭.

Can we make it work?

## Making the collection iterable

> TypeError: Team is not a function or its return value is not iterable

This 👆 is the error you’d get if you try to iterate through the team using for…of.

Luckily for us, the iterable protocol allows us to make objects iterable:

> In order to be iterable, an object must implement the @@iterator method, meaning that the object (or one of the objects up its prototype chain) must have a property with a @@iterator key which is available via constant Symbol.iterator

Looks promising, let’s give it a try:

```js
class Team {
  // Rest of the class

  [Symbol.iterator]() {
    return this.\_people[Symbol.iterator]();
  }
}
```

It works! 👏

We can now iterate through the collection like this:

```js
for (let member of team) {
  console.log(member.fullname);
}
```

We could have defined our own implementation of the iteration behaviour, but in this case, we can just use Array‘s iterator directly 🙌.

## Exposing the length of the collection

`team.length` currently returns `undefined` because `Team` doesn’t have a property or getter with that name.

We can solve this easily by implementing a new length getter:

```js
class Team {
  // Rest of the class

  get length() {
    return this.\_members.length;
  }
}
```

## Exposing other useful methods

You might be wondering… This is pretty cool, but what if I want to use any of the other methods provided by Array? Something as useful as Array.prototype.includes()?

Well, we can use delegation to forward the request to the internal collection:

```js
class Team {
  // Rest of the class

  includes(person) {
    return this.\_people.includes(person);
  }
}
```

## Conclusion

By encapsulating the collection of members inside the Team class, we’re preventing unwanted modifications of the collection from the outside, and providing a nice interface to interact with the collection.

This can be easily done by:

1. Defining getters and methods to manipulate or access the collection.
2. Provide an Array like experience by implementing a length getter and the Symbol.iterator method.

Here’s a link to the before and after versions of the code:

[https://gist.github.com/alonsogarciapablo/110b92c3d19f0074dd416286cae1a036](https://gist.github.com/alonsogarciapablo/110b92c3d19f0074dd416286cae1a036)
