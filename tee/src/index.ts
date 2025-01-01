import { setTimeout } from 'timers/promises';

async function main() {
  const encoder = new TextEncoder();
  let interval: NodeJS.Timeout | undefined = undefined;
  const originalStream = new ReadableStream({
    start(controller) {
      const exit = async () => {
        controller.close();
        console.log('Received SIGTERM. shutdown now...');
        await setTimeout(5000);
        console.log('bye');
        process.exit(0);
      }
      process.on('SIGTERM', exit);
      process.on('SIGINT', exit);
    },
    pull(controller) {
      controller.enqueue("Hello World");
    },
    cancel() {
      if (interval != undefined)
        clearInterval(interval);
    },
  });

  const [stream1, stream2] = originalStream.tee();
  const reader1 = stream1.getReader();
  const reader2 = stream2.getReader();
  const handleStream = async (text: string, reader: ReadableStreamDefaultReader<string>) => {
    while (true) {
      const { done, value } = await reader.read();
      if (done) return
      console.log(`${text}: ${value}`);
      await setTimeout(1000);
    }
  }
  handleStream('reader1', reader1);
  handleStream('reader2', reader2);
}

main();
