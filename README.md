## What's the project?

The project is a test to solve some problems of github-markdown-css in reblog-theme-macaron.

## How to use the project?

If you don't want to use my products, you can build css files of the project on your local pc.

## How to build the css project?

Clone the project using this command:

```bash
git clone https://github.com/FloatSheep/macaron-github-markdown-css.git
```

Install the dependencies:

```bash
npm install
```

Execute the build command:

```bash
npm run build
```

If you use pnpm and other package managers, you can use `<name of the package manager> (run) build` to build.

And if you’re using pnpm or any other package manager, you can adapt the command accordingly. Just remember that sometimes the (run) part is optional in certain package managers. If you’re unsure, stick to the traditional command—it won’t steer you wrong!

## Note

Now, I change the version to `1.1.0`. Why? Because I caught the big bug in the project.

I change some logic. For example, `processingVariables.js` is going to visit media selector at first, then it is going to copy styles and create a new selector instead copy all media selector.

I hope you'll like it.

While creating the project, I used these tools:

- Copilot: I used it to improve my code and invoking CSSTree
- CSSTree: I used it to operate cssom tree in a dynamic way. Because of the package, i can adapt modifications of `github-markdown-css` in a more convenient way
- global-agent: I used it to proxy requests of `github-markdown-css` in the network environment of China.