# Flash Royale
Flash Royale is a webapp where you can create and edit flashcard sets, then create and join rooms where you can use those sets to play against your friends. Answering questions correctly earns you XP which allows you to attack the opponent. You can also use XP to heal yourself. The first person to reach 0% health loses.
### Tech Stack
- Built with NextJs hosted on cloudflare workers using opennext.
- User data and flashcard sets stored on cloudflare d1 using drizzle-orm.
- Rooms and the room registry hosted using cloudflare durable objects.

### Screenshots
![image](https://github.com/user-attachments/assets/b5fae1a5-bb5c-44c2-8e3b-5065154323d8)
![image](https://github.com/user-attachments/assets/df520290-c431-4ebd-8f15-3d63eafb5d37)
![image](https://github.com/user-attachments/assets/f808c903-bc85-44bc-9d9b-bd3e82ceedf2)
![image](https://github.com/user-attachments/assets/2ed84769-ab1b-4a8c-9fc0-0ca4a06699e8)
![image](https://github.com/user-attachments/assets/11c69b7f-2369-4031-84cc-79ecc99a390d)


### Hosting
To run the dev server run:

```bash
npm run dev
```

To change enviroment variables on the dev server use:

```bash
.env.local
```

To preview the app run:

```bash
npm run preview
```

To change enviroment variables in the preview use:

```bash
.dev.vars
```

To deploy run:

```bash
npm run deploy
```

To change enviroment variables in production use:

```bash
wrangler.jsonc # for variables
wrangler secret put # for secrets
```
