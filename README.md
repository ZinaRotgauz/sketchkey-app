# SketchKey Creative Assistant
SketchKey is a React Native app ( addition to existing printer) designed to bring your creative ideas to life. Using speech recognition, you can generate either a sketch or text with AI assistance. The app provides an interactive, step-by-step process to select an output format, define a style (for sketches), and input creative prompts.

## 🚀 Features
🎤 Voice-Controlled Input – Speak your idea, and SketchKey will understand!

🎨 Sketch Generation – Choose from different artistic styles: Sketchy, Flow, Angle, Handwritten.

✏️ Text Generation – Describe what you want, and the AI will generate text.

📊 Real-Time Progress Tracking – A visual progress bar to show task execution.

🔄 Restart Option – Easily create more sketches or text without restarting the app.

The Frontend part is written with the help of React Native, and the server side is represented by server.js that receives the prompt style and output parameters, and calls a python script, that enables the communication with an OpenAI model 
( API version 0.28 the code is also written in the syntax and grammar of an older API version),
translation to vector graphics and further translation to G-code to enable the printer to perform the output.


## 📱 Screens & Flow
- Welcome Screen – Introduction to SketchKey.
- Output Selection Screen – Choose between Sketch or Text generation, pick styles and input your prompt.
- Loading Screen – Simulated AI processing.
- Start Again Screen – Option to create another piece of content.

## 🔧 Tech Stack
* React Native
* React Hooks (useState, useEffect, useCallback)
* SpeechRecognition API
* Animated API (for progress bar)
* Node.js (for backend Python integration)
* python libraries ( cv2, svg2path, pillow, serial svgwrite etc.)

  
## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `python main.py`

At the same time you start the GUI you are supposed to run the python script.

### run the server.js manually by pressing a run button or via `node server.js`

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
