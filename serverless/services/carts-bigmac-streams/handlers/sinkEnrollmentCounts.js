import { kafkaConnect } from '../libs/kafka-connect';

async function myHandler(event, _context, _callback) {
  const json = JSON.parse(event.value);

  if(json.NewImage.enrollmentCounts) {
    try {
      const { producer } = await kafkaConnect();
      await producer.send({
        topic: "aws.mdct.seds.cdc.enrollment-counts.v0",
        messages: [{
          schema: {
            type: "struct",
            optional: false,
            name: "test", 
            fields: [
              {
                type: "string",
                optional: false,
                field: "test",
              }
            ],
          },
          payload: {
            test: "hello world",
          },
        }],
      });
      await producer.disconnect();
    } catch(error) {
      console.log(error);
    }
  }
}

exports.handler = myHandler;
