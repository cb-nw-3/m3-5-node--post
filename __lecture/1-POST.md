# Express Methods

---

## GET

So far, we've seen the `.get` method:

```js
express.get('/', (req, res) => {
  // ...
});
```

---

In HTTP, there are several "methods" for making requests.

When you go to your browser and enter a URL, it performs a `GET` request.

---

You can control which method gets used by setting it on a `<form>` tag:

```html
<form method="GET" action="/">
  <input name="email" />
  <button>Submit</button>
</form>
```

---

## POST

There's another very prominent HTTP method: `POST`.

There are two lenses to look at this through: technical and semantic.

Let's start with semantic

---

A POST request is meant to convey that _something new is being created_. For example, a signup form:

```html
<form method="POST" action="/signup">
  {/* fields for name, email, password */}
  <button>Submit</button>
</form>
```

---

A GET request is used to, well, get information. For example, a search form:

```html
<form method="GET" action="/search">
  <input name="q" />
  <button>Search</button>
</form>
```

---

# Technical side

When you make a POST request, additional data is sent along with the request.

It's known as the "body".

GET requests don't have this. The only way to pass data with a GET request is inside the URL, with query params `/search?q=cat-photos`

---

`GET` requests are not secure, in the sense that any data sent with the request is

- visible all along its merry way to the server
- cached in browser history.

_In the context of Node, the `get` is our server answering a simple request for information._

---

# Exercise

Identify the right method for the form

---

```html
<h1>Fridge contents</h1>

<ul>
  <li>Apple</li>
  <li>Banana</li>
</ul>

<form method="?" action="/add">
  <input name="item" type="text" />
  <button>Add new item</button>
</form>
```

---

```html
<form method="?" action="/login">
  <input name="email" type="email" />
  <input name="password" type="password" />
  <button>Log In</button>
</form>
```

---

```html
<form method="?" action="/logout">
  <button>Sign out</button>
</form>
```

---

# It's not just about HTML forms

Soon, we will see how to submit requests through the browser without using forms.

For now, though, we've only seen two ways:

- Through `<form>` (any method)
- By entering a URL in the browser (always a GET)

---

There are other HTTP methods, for different semantic purposes:

- PATCH (edit something)
- PUT (replace one thing with another)
- DELETE (remove an existing thing)

They all function identically to POST, from a technical perspective.

---

# Express

In Express, we can listen for POST requests the same way we listen for GET requests:

```js
express()
  .get('/', ...)
  .post('/signup', ...)
```

---

We can access the "body" (additional data) through `req.body`:

```js
.post('/signup', (req, res) => {
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };
});
```

---
