# Node Image Cropper

Node Image Cropper is a simple Node.js application for cropping images. This tool allows you to crop images to specified dimensions. It uses [`sharp`](https://www.npmjs.com/package/sharp) under the hood to manipulate images.

## Features

- Crop images to 16:9 aspect ratio
- Supports various image formats (JPEG, PNG, etc.)

## Installation

To install the dependencies, run:

```bash
npm install
```

## Usage

To crop an image, use the following command:

```bash
node index.js -i <inputImagePath> [-o <outputImagePath>]
```

- `inputImagePath`: Path to the input image
- `outputImagePath` (optional): Path to save the cropped image. If not provided, the output image will be saved as `<inputname>_output.jpg`.

## Example

```bash
node index.js -i input.jpg -o output.jpg
```

This command will crop a from `input.jpg` starting at coordinates (50, 50) and save it as `output.jpg`.

## License

This project is licensed under the MIT License.
