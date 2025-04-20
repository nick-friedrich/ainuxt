If we want to import the lib into our nuxt app, we need to import it via pnpm

Add to `package.json`

```json
"dependencies": {
  "@layers/mail": "workspace:*"
}
```

Then we can import it in our nuxt app

```ts
import { sendEmail } from "@layers/mail/mail";
```
