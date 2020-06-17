# Errors

---

### What is an error?

A notification that something went wrong, and a clue towards fixing it.

```js
let hi = 10;
console.log(hii);

// ReferenceError: hii is not defined
```

---

We can write our own errors, for when things happen that we don't expect

```js
function greetUser(name) {
  if (typeof name === 'undefined') {
    throw new Error('Please supply a name!');
  }

  console.log(`hi ${name}!`);
}
```

---

# Try / catch

What if we _expect_ an error might occur?

```js
function greetIfPossible(name) {
  try {
    greetUser(name);
  } catch (err) {
    console.log(err);
  }
}
```

---

# Why?

try/catch is useful in a few cases:

- You want to do some additional reporting when an error occurs
- It's not the end of the world if the code doesn't work
- You're using a library, and it throws an error, but it's actually no big deal.
- You can "group" error handling in 1 place

---

```js
try {
  riskyOperation1();
  riskyOperation2();
  riskyOperation3();
  riskyOperation4();
} catch (err) {
  console.error('An error has occured', err);
  emailAdministrator();
}
```
