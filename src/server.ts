import express, { Response, Request } from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get('/filteredimage', async (req: Request, res: Response) => {
    const { image_url } = req.query;
    
    if (!image_url) {
      res.status(404).send("Please provide a valid image url with the parameter ?image_url=")
      return;
    }

    try {
      const pathToImage = await filterImageFromURL(image_url);
      res.sendFile(pathToImage, (err) => {
        if (err) {
          console.error(err);
          res.status(404).send(err)
        }
        deleteLocalFiles([pathToImage])
      })
    } catch (err) {
      console.error(err)
      res.status(400).send("Error trying to filter your image, try with a valid url.");
    }
  })

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();