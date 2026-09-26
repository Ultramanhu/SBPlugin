declare module "pubsub-js" {
  export function subscribe(
    topic: string,
    handler: (topic: string, payload: any) => void
  ): string;

  export function publish(topic: string, payload: any): boolean;
}
