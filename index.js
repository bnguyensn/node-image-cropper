// Import the necessary libraries
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const { program } = require("commander");

async function cropTo16by9(inputPath, outputPath) {
  try {
    // Load the image metadata
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    const { width, height, format } = metadata;

    if (!width || !height) {
      throw new Error("Invalid image dimensions");
    }

    // Ensure the output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Aspect ratio for 16:9
    const targetAspectRatio = 16 / 9;
    let cropOptions;

    if (width >= height) {
      // Landscape or square image
      const targetWidth = Math.min(
        width,
        Math.round(height * targetAspectRatio)
      );
      const targetHeight = Math.min(
        height,
        Math.round(width / targetAspectRatio)
      );

      cropOptions = {
        left: Math.round((width - targetWidth) / 2),
        top: Math.round((height - targetHeight) / 2),
        width: targetWidth,
        height: targetHeight,
      };
    } else {
      // Portrait image, rotate first
      const rotatedImageBuffer = await image.rotate(90).toBuffer();
      const rotatedMetadata = await sharp(rotatedImageBuffer).metadata();

      const rotatedWidth = rotatedMetadata.width;
      const rotatedHeight = rotatedMetadata.height;

      const targetWidth = Math.min(
        rotatedWidth,
        Math.round(rotatedHeight * targetAspectRatio)
      );
      const targetHeight = Math.min(
        rotatedHeight,
        Math.round(rotatedWidth / targetAspectRatio)
      );

      cropOptions = {
        left: Math.round((rotatedWidth - targetWidth) / 2),
        top: Math.round((rotatedHeight - targetHeight) / 2),
        width: targetWidth,
        height: targetHeight,
      };

      await sharp(rotatedImageBuffer)
        .extract(cropOptions)
        .toFormat(format)
        .toFile(outputPath);

      console.log(`Cropped and rotated image saved to ${outputPath}`);
      return;
    }

    // Perform cropping and save the output
    await image.extract(cropOptions).toFormat(format).toFile(outputPath);

    console.log(`Cropped image saved to ${outputPath}`);
  } catch (error) {
    console.error("Error processing the image:", error);
  }
}

// Configure CLI options
program
  .requiredOption("-i, --input <path>", "Path to the input image")
  .option("-o, --output <path>", "Path to the output image");

program.parse(process.argv);

const options = program.opts();

// Determine input and output paths
const inputImagePath = options.input;
let outputImagePath = options.output;

if (!outputImagePath) {
  const inputDir = path.dirname(inputImagePath);
  const inputBaseName = path.basename(
    inputImagePath,
    path.extname(inputImagePath)
  );
  const inputExt = path.extname(inputImagePath);
  outputImagePath = path.join(inputDir, `${inputBaseName}_output${inputExt}`);
}

// Run the cropping function
cropTo16by9(inputImagePath, outputImagePath);
