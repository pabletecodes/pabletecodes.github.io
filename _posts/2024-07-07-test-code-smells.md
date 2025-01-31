In [Fixing Design with Tests](https://youtu.be/fsvRXOADWnw?si=xvfEjKQLWSgi8fP8), Michael Feathers makes a very interesting point:

> the ease and test design should be a side effect of having good design around the thing that you’re testing

In other words, **if you’re having a hard time writing tests for a unit of code, it’s probably an indication of a poor code design. Go fix the design of your code and testing will become easier** ✨.

Let’s illustrate this idea with a simple example.

## A simple example

Let’s imagine a pretty common `HttpClient` class:

```js
class HttpClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async get(endpoint) {
    const url = `${this.baseURL}${endpoint}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Other methods like post, etc.
}
```

With this abstraction, we can make “get” HTTP requests easily, like:

```js
const httpClient = new HttpClient("https://api.example.com");
httpClient
  .get("/users")
  .then((data) => console.log(data))
  .catch((error) => console.error(error));
```

Now, let’s imagine we have some sort of “repository” class that makes use of the `HttpClient` to access and manipulate “users” from a remote API:

```js
class UserRepository {
  constructor(baseURL) {
    this.httpClient = new HttpClient(baseURL);
  }

  async getUser(id) {
    try {
      return await this.httpClient.get(`/users/${id}`);
    } catch (error) {
      console.error(`Failed to get user with id ${id}:`, error);
    }
  }

  // Other methods like listUsers, createUser, updateUser, etc.
}
```

Awesome! Now we have abstracted the access and manipulation of “users”, so it’s really easy to perform CRUD operations:

const userRepository = new UserRepository('https://api.example.com');

```js
userRepository
  .getUser(1)
  .then((data) => console.log(data))
  .catch((error) => console.error(error));
```

And, this is the current design of our code:

{% include figure popup=true image_path="assets/images/posts/test-code-smells/image-01.webp" alt="The current design of our code" caption="The current design of our code" %}

So far, so good. But wait, we need to test this code!

Let’s now add some tests for our new `UserRepository` class.

## Unit testing `UserRepository`

Here’re a couple of things I would like to test for each of the methods in the `UserRepository` class:

1. The right HTTP request is performed.
2. The response from the server is handled and returned correctly.

In a unit test case, we typically provide some input and assert the output to ensure the function or method behaves as expected. But, **here’s the problem with our design**:

> `UserRepository` depends on the external class `HttpClient` and this prevents us from easily mocking or replacing it. Both classes are tightly coupled.

Now, we have two options:

## 1. Fixing the tests

We can workaround this issue by “fixing the tests” in a couple of ways:

### Mocking the global fetch function

This is a pretty common approach:

```js
const UserRepository = require('./UserRepository');

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ id: 1, name: 'John Doe' }),
  })
);

describe('UserRepository', () => {
  let userRepository;

  beforeEach(() => {
    fetch.mockClear();
    userRepository = new UserRepository('http://example.com');
  });

  describe('getUser', () => {
    let userData;

    beforeEach(() => {
      userData = await userRepository.getUser(1);
    });

    it('makes a request with the right params', async () => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith('http://example.com/users/1');
    });

    it('returns the data correctly', async () => {
      expect(userData).toEqual({ id: 1, name: 'John Doe' });
    });
  });
});
```

### Mocking the “httpClient” module

Jest also provides [a way to mock a whole module](https://jestjs.io/docs/jest-object#jestmockmodulename-factory-options):

```js
const { UserRepository } = require("./userRepository");
const { HttpClient } = require("./httpClient");

jest.mock("./httpClient", () => {
  return {
    ...jest.requireActual("./httpClient"),
    HttpClient: {
      get: jest.fn(),
      post: jest.fn(),
    },
  };
});

const mockUserData = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
};

describe('UserRepository', () => {
  let userRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    userRepository = new UserRepository('https://api.example.com');
  });

  describe('getUser', () => {
    let userData;

    beforeEach(() => {
      mockHttpClient.get.mockResolvedValue(mockUserData);
      const userData = await userRepository.getUser(1);
    });

    it('makes a request with the right params', async () => {
      expect(mockHttpClient.get).toHaveBeenCalledWith('/users/1');
    });

    it('returns the data correctly', async () => {
      expect(userData).toEqual(mockUserData);
    });
  });

  // More tests here
});
```

Both of these options (mocking a global object, or mocking a whole module with Jest) are pretty common, but they force our tests to know the internals of the unit we’re testing, so they are coupled to the actual implementation of our class. These solutions are only hiding the real problem 😢.

### 2. Fixing the design of the code

**A better option is to fix the design of the code** by decoupling `UserRepository` and `HttpClient` via dependency injection.

> Dependency injection is a programming technique in which an object or function receives other objects or functions that it requires, as opposed to creating them internally. Dependency injection aims to separate the concerns of constructing objects and using them, leading to loosely coupled programs.

Let’s implement this:

```js
class UserRepository {
  constructor(baseURL, httpClient = null) {
    this.httpClient = httpClient || new HttpClient(baseURL);
  }

  // The rest of the class remains the same
}
```

Our design now looks like this:

{% include figure popup=true image_path="assets/images/posts/test-code-smells/image-02.webp" alt="The current design of our code" caption="The current design of our code" %}

Now `UserRepository` accepts an `HttpClient` in the constructor. This removes the hard-coded dependency from UserRepository and makes it easier for us to provide different implementations of the `HttpClient`. Both classes are now **loosely coupled**.

We can now provide/inject a mock `HttpClient`, isolating the class under test:

```js
const { UserRepository } = require('./userRepository');

describe('UserRepository', () => {
  let userRepository;
  let mockHttpClient;

  const mockUserData = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com'
  };

  beforeEach(() => {
    mockHttpClient = {
      get: jest.fn(),
      post: jest.fn()
    };
    userRepository = new UserRepository('https://api.example.com', mockHttpClient);
  });

  describe('getUser', () => {
    let userData;

    beforeEach(() => {
      mockHttpClient.get.mockResolvedValue(mockUserData);
      const userData = await userRepository.getUser(1);
    });

    it('makes a request with the right params', async () => {
      expect(
        mockHttpClient.get
      ).toHaveBeenCalledWith('/users/1');
    });

    it('returns the data correctly', async () => {
      expect(userData).toEqual(mockUserData);
    });
  });

  // More tests here
});
```

By making the dependency explicit, we improved the overall design, and our test can focus on verifying the behaviour of the `UserRepository` class without being concerned with its internal details, ensuring that our tests are both robust and maintainable 💪.

### Some “test code smells” to look for

We saw a simple yet common example of a class that was hard to test due to tight coupling with another class, and we improved its design and testability by using dependency injection.

Now you can look at your own tests and find opportunities to improve the design of your code! 👏

Here’re are some **specific “test code smells” or “testing pains” you can look for**:

- Difficulty mocking some dependencies.
- Tests that are brittle and break when you change other parts of your codebase.
- Tests that are not deterministic.
- Tests with large or difficult setups.
- Tests that test the implementation details rather than the expected behaviour.
- Tests that are slow (eg: because they access external resources).
- Tests that are hard to understand.

## Wrap up

Michael Feathers, in "Fixing Design with Tests," emphasizes that good code design naturally leads to easier testability. Difficulty in writing tests often points to poor design, suggesting a need for redesign.

We saw a very simple yet common example of a class that was hard to test because it was tightly-coupled to another. By using dependency injection, we fixed the design of the class and made it easier to test it.

By looking for “test design smells” in your codebase —such as brittleness, complex setup, testing implementation details — you can proactively find opportunities to restructure and improve the overall design of your code.
