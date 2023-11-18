---
title: Decorator Pattern in Golang
description: Decorator pattern is the one of the simple yet very useful pattern, and this time we're going to look at how we can implement it in Go programming language.
publishDate: 16 Oct 2023
pubDate: 16 Oct 2023
---
Decorator pattern is one of the simplest pattern in Go yet it also solves a lot of problems.
Let's take a look.

So, let's say we're building a simple HTTP handler that handles the endpoint `/hello` with a response "Hello there!".

We usually have code that looks like this.
```go
package main

import (
    "fmt"
    "net/http"
)

func handleSayHello(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintln(w, "Hello there!")
}

func main() {
    http.HandleFunc("/hello", handleSayHello)
    http.ListenAndServe(":8080", nil)
}
```

There's nothing wrong with the code. But let's add another simple functionality.
The endpoint now reads the GET parameter named "name" in the URL.
Then we only greet the user if the name exists in the database.

To do that, we'll need a `sql.DB` variable to store our database connection.
Our first instinct would mostly be creating that database connection as a global variable, as seen in below code.

```go
var DB *sql.DB
[...]

func main() {
    DB, err := sql.Open(...)
    [...]
}
```

Then we use it inside the handler. I'm omitting the database query part because its not the focus of this article.

```go
func handleSayHello(w http.ResponseWriter, r *http.Request) {
	name := strings.ToLower(r.URL.Query().Get("name"))
    isNameExists := getIfNameExists(db)
	if !isNameExists {
		fmt.Fprintln(w, "Your name is not in the list!")
        return
    }
    fmt.Fprintln(w,
        fmt.Sprintf("Hello there, %s!", name),
    )
}
```

OK, it works now.

There's nothing wrong in using a global variable. But writing tests with a global variable dependency would be difficult.
What if we want to test it on an in-memory database? We can't swap it if it is in the global variable.

To solve this, we can put it in our handler's parameter. Like so:

```go
func handleSayHello(db *sql.DB, w http.ResponseWriter, r *http.Request) {
    [...]
}
```

But now, the `http.HandleFunc` function complains. The function originally accepts a `func (http.ResponseWriter, *http.Request)` function signature,
and currently it's receiving `func (*sql.DB, http.ResponseWriter, *http.Request)`.

Now, the million dollar question,
> **How do we inject the DB variable inside the function as parameter without breaking the function signature needed by the `http.HandleFunc` function?**.

## Decorator Pattern

One of the ways to solve this is by using a Decorator Pattern implemented using a function.
This is unlike the common Object Oriented design pattern, which uses classes. In this case, using a function is enough.
The function's purpose is to wrap the given function and inject the
parameter while returning a function that fits with the function signature.

Here is one example to solve the problem we had earlier.

```go
func sayHelloHandler(db *sql.DB, w http.ResponseWriter, r *http.Request) {
    // Use your DB here
    isNameExists := getIfNameExists(db)
    [...]
}

func withDependency(
    db *sql.DB,
    handler func(db *sql.DB, w http.ResponseWriter, r *http.Request),
) http.HandlerFunc {
    return func(w http.Response, r *http.Request) {
        handler(db, w, r)
    }
}

func main() {
    http.HandleFunc("/hello", withDependency(db, sayHelloHandler))
    http.ListenAndServe(":8080", nil)
}
```

How does this work? Let's take a look deeper into the `withDependency` function.

The point of `withDependency` is **passing in the dependency** we want to
the modified handler and **returning the handler function** that *runs our modified handler*.

```go
return func(w http.ResponseWriter, r *http.Request) {
    handler(db, w, r)
}
```

The return function is what's interesting here. It returns an anonymous function that fits with the function signature we wanted.
And inside, it calls the modified handler.

This anonymous function is the actual function being called as the handler.
We just pass in the handler's `http.ResponseWriter` and `*http.Request` and also our dependency.

To simplify for multiple dependencies, we can use a struct that contains all our dependencies then pass it to the decorator function.

```go
type Dependencies struct {
    DB *sql.DB
    Logger *log.Logger
    [...]
}

type HandlerFn func(deps *Dependencies, w http.ResponseWriter, r *http.Request)

func withDependency(
    deps *Dependencies,
    handler HandlerFn,
) {
    return func(w http.ResponseWriter, r *http.Request) {
        handler(deps, w, r)
    }
}
```

That's all.
If there is any mistakes, please contact me via email, shown in my About Page.

Thank you!
