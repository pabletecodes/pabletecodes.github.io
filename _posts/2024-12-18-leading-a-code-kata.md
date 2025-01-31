---
title: "Leveling Up Together: My Experience Designing, Implementing and Leading a Code Kata"
excerpt: "The story of how I designed, implemented and led a Code Kata for some of my teammates! 🧑🏻‍💻"
---

Last week, I led a Code Kata for some of my teammates at [Empathy.co](https://empathy.co/).

In case you don’t know what a Code Kata is, here’s a brief definition:

> **A code kata is a structured exercise in programming, designed to help developers practice and improve their skills through repetition and deliberate practice.** Borrowing the term "kata" from martial arts, where practitioners refine techniques through repeated drills, a code kata emphasizes mastery of coding techniques, problem-solving strategies, and collaboration in a low-pressure environment.

This wasn’t the first time I had led a Code Kata for a group of people. I had already done it several times before, but always using existing katas like the famous [Gilded Rose Refactoring Kata](https://github.com/emilybache/GildedRose-Refactoring-Kata).

In this case, I had a very specific goal in mind:

> To introduce my teammates to [Domain-driven design](https://en.wikipedia.org/wiki/Domain-driven_design), the [layered architecture](https://en.wikipedia.org/wiki/Multitier_architecture), and the [Dependency Inversion Principle](https://en.wikipedia.org/wiki/Dependency_inversion_principle), so they would be motivated to apply these approaches, patterns and principles, to the codebase(s) we’re working on.

To achieve this goal, **I decided to design a Code Kata from scratch**.

## Designing the Code Kata

I wanted the Kata to:

1.  be small enough to be completed in ~2 hours
2.  present enough learning opportunities
3.  be realistic (ie: similar to the code we’re dealing with on a daily basis).

After some brainstorming, I settled on a simple Sign up form implemented using [Vue.js](https://vuejs.org/), the technology we’re currently using as the presentation layer at [Empathy.co](https://empathy.co/).

The starting point was a “big” component that renders a Sign up form, and also contains some application logic (eg: persisting the user and sending a confirmation email) and domain logic (eg: validations). This “view” only has one dependency:

{% include figure popup=true image_path="assets/images/posts/leading-a-code-kata/initial-state.webp" alt="A diagram of the starting point" caption="This is what the starting point looks like at a very high level" %}

The Kata was designed to learn (by doing) the following topics:

1.  Decoupling the application logic from the presentation logic by using application services (also known as use cases)
2.  Reverting a dependency between two components applying the Dependency Inversion Principle
3.  Modeling a domain using aggregates, entities and value objects
4.  Modeling a domain using domain services

I was hoping participants would be able to refactor the code in something that looked like this:

{% include figure popup=true image_path="assets/images/posts/leading-a-code-kata/final-state.webp" alt="A diagram of the final state" caption="
This is the final state I was hoping to get to
" %}

## **Implementing the Code Kata**

During the weeks leading up to the kata, I implemented the starting point for the kata, which you can find here:

[https://github.com/alonsogarciapablo/vue-js-refactoring-kata](https://github.com/alonsogarciapablo/vue-js-refactoring-kata)

This is what you see when you first run the app:

{% include figure popup=false image_path="assets/images/posts/leading-a-code-kata/screenshot.webp" alt="A screenshot of the app" caption="
I didn’t spend much time making it pretty 😊
" %}

The repo also contains a suite of unit tests for the main component, so that the code can be refactored with confidence:

```bash
     ✓ src/views/__tests__/SignupView.test.ts (14)
       ✓ SignupView (14)
         ✓ should show the form and no errors
         ✓ when the form is invalid (9)
           ✓ should show an error if the name is empty
           ✓ should show an error if the email is empty
           ✓ should show an error if the email is invalid
           ✓ should show an error if the email has already been used
           ✓ should show an error if the birthday is empty
           ✓ should show an error if the user is not older than 18
           ✓ should show an error if the password is too short
           ✓ should show an error if the passwords don't match
           ✓ should show multiple errors
         ✓ when the form is valid (4)
           ✓ should not show any errors
           ✓ should not show the form
           ✓ should show a confirmation message
           ✓ should create a user with an encrypted password

     Test Files  1 passed (1)
          Tests  14 passed (14)
       Start at  11:07:07
       Duration  196ms


     PASS  Waiting for file changes...
           press h to show help, press q to quit
```

## Preparing for the Session

Since I wanted to touch on [Domain-driven design](https://en.wikipedia.org/wiki/Domain-driven_design), the [layered architecture](https://en.wikipedia.org/wiki/Multitier_architecture), and the [Dependency Inversion Principle](https://en.wikipedia.org/wiki/Dependency_inversion_principle), I **prepared a simple presentation** with some slides to introduce the participants to all three topics.

To ensure there would be enough time to complete the Kata in the slotted time (~2h) and also to be super-well-prepared during the session, **I completed the Kata myself at least 4 times**.

Every time, I committed very often (more than usual) and timed myself.

Practicing in advance, and reviewing my commits helped me:

1.  Refine the order in which the exercises could be completed.
2.  Have a clear plan for each of the exercises.
3.  Create checkpoints so that participants could start each exercise from the same point.

Once I had a solution I felt good about, I created the following Git branches:

- `main` - the starting point
- `refactor-step-1` - [the solution for exercise 1](https://github.com/alonsogarciapablo/vue-js-refactoring-kata/compare/main...refactor-step-1)
- `refactor-step-2` - [the solution for exercise 2](https://github.com/alonsogarciapablo/vue-js-refactoring-kata/compare/refactor-step-1...refactor-step-2)
- `refactor-step-3` - [the solution for exercise 3](https://github.com/alonsogarciapablo/vue-js-refactoring-kata/compare/refactor-step-3...refactor-step-4)
- `refactor-step-4` - [the solution for exercise 4](https://github.com/alonsogarciapablo/vue-js-refactoring-kata/compare/refactor-step-3...refactor-step-4)
- `refactor-step-5` - [the solution for exercise 5](https://github.com/alonsogarciapablo/vue-js-refactoring-kata/compare/refactor-step-4...refactor-step-5) and final solution.

Practicing gave me a lot of confidence, and I felt ready for the session! 💪

## **The Code Kata Session**

At the start of the session, I gave a brief introduction to explain the goals for the session, as well as the 3 different concepts / ideas I wanted to cover.

I then organized participants into pairs, asked each of the pairs to seat side-by-side with one laptop, shared the repo, and asked them to follow the instructions on the [README](https://github.com/alonsogarciapablo/vue-js-refactoring-kata/blob/main/README.md).

{% include figure popup=false image_path="assets/images/posts/leading-a-code-kata/sessions.webp" alt="Participants working on the code kata" caption="
Participants working in pairs during the session
" %}

Once every “team” was ready, I presented the first exercise:

{% include figure popup=false image_path="assets/images/posts/leading-a-code-kata/slide.webp" alt="An image of a slide from my slide deck" caption="
I provided some recommended steps for each of the exercises
" %}

Each exercise lasted 25 minutes (one 🍅), followed by a 5 minute explanation of my solution to the exercise.

We completed 3 out of the 5 planned exercises, so I used the remainder of the time to walk participants through my code for the exercises that we didn’t finish.

## Conclusion

Overall, I really enjoyed preparing the Code Kata and leading the session!

Leading it in person was fun and my teammates were pretty engaged throughout the session. Time flew by, so next time I will have to book more time or reduce the scope.

Having a mix of theory and practice worked really well, and it was a great way to learn about specific topics!

If you’re interested in doing (or facilitating) this Kata yourself, check out the following repo:

[https://github.com/alonsogarciapablo/vue-js-refactoring-kata](https://github.com/alonsogarciapablo/vue-js-refactoring-kata)

The [README](https://github.com/alonsogarciapablo/vue-js-refactoring-kata/blob/main/README.md) contains everything you need to set up the project, as well as the instructions for the different exercises.

Happy learning!
