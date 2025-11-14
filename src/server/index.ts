import { Hono } from "hono";
import { serve } from "@hono/node-server";

import path from "path";
import { deleteTask, listTasks, upsertTask } from "./db";


const app = new Hono();


app.get('/tasks', async (c) => {
    const tasks = await listTasks();

    console.log(`fetched ${tasks.length} tasks...`)

    return c.json({
        tasks
    })
})

app.post('/task/:id', async (c) => {
    const id = c.req.param('id')
    const body = await c.req.json();
    const task = body.task;

    const result = upsertTask({...task, id: parseInt(id)});

    console.log('updated: ', result)

    return c.json({
        task: result
    })
})

app.post('/task/', async (c) => {
    const body = await c.req.json();
    const task = body.task;
    const result = upsertTask(task);

    console.log('created: ', result)

    return c.json({
        task: result
    })
})

app.delete('/task/:id' , async (c) => {
    const id = c.req.param('id')

    console.log('deleted: ', id)

    const result = deleteTask(parseInt(id))

    return c.json({
        success: result
    })
})


const currentFile = __filename; //fileURLToPath(import.meta.url);
const entryFile = path.resolve(process.argv[1]);

if (currentFile === entryFile) {
  console.log("starting server on port 4001...");
  serve({
    fetch: app.fetch,
    port: 4001,
  });
}

export default app;