import sys
import openai
import requests
from PIL import Image
from io import BytesIO
import cv2
import os
import numpy as np
import svgwrite

from svgpathtools import svg2paths
import serial
import time
import svgwrite
import cairo

#-----------------Zina----------------------------------------
STYLE_PROMPTS = {
    'sketchy': 'I want to sketch a very simple [childish] drawn outline in black without text in one line',
    'flow': 'I want to sketch a simple [flowy] styled outline in black in one line',
    'angle': 'I want to sketch a very simple [angled] styled outline in black with sharp edges in one line',
    'handwritten': 'I want to sketch a very simle[handwritten] styled outline in black in one line'
}

# Set OpenAI API key
# here the env variable is not used (but for good coding ethics it should be) and the api key is usually embedded as it is so for security measures we leave this space open 
# for testing or usage please contact to get the key or make your own
openai.api_key = 'your-open-api-key'

def generate_response(prompt, style, output):
    adjusted_prompt = ''
    prompt_text=''
    if style in STYLE_PROMPTS:
        adjusted_prompt = (f'I want to draw a {prompt} {STYLE_PROMPTS[style]}')

    if output == 'text':
        prompt_text=(f'Please create a short message (3 words maximum) using this input: {prompt}')
        response = openai.ChatCompletion.create(
            model='gpt-4',
            messages=[{'role': 'user', 'content': prompt_text}]
        )
        return response['choices'][0]['message']['content']
    elif output == 'sketch':
        response = openai.Image.create(
            prompt=adjusted_prompt,
            n=1,
            size='512x512'
        )
        # Get the URL for the generated image
        image_url = response['data'][0]['url']

        # Download and save the image
        img_data = requests.get(image_url).content
        filename = '/Users/lokaladmin/Downloads/sketchkey-app-2/src/output.png'  # or dynamically generate a filename
        with open(filename, 'wb') as f:
            f.write(img_data)
            
        return filename
    
        



#-----------------Vova----------------------------------------

def png_to_svg(input_png_path, output_svg_path, scale_factor=0.1):
    # Ensure absolute paths for macOS compatibility
    input_png_path = os.path.abspath(input_png_path)
    output_svg_path = os.path.abspath(output_svg_path)

    # Read the image in grayscale (explicit check for None)
    image = cv2.imread(input_png_path, cv2.IMREAD_UNCHANGED)
    if image is None:
        raise FileNotFoundError(f"File not found or invalid format: {input_png_path}")

    # Convert to grayscale if the image is not already
    if len(image.shape) == 3:
        image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Get image dimensions
    height, width = image.shape[:2]

    # Convert to binary using adaptive thresholding (better cross-OS support)
    _, binary = cv2.threshold(image, 127, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)

    # Find contours (ensure proper hierarchy handling)
    contours, hierarchy = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    if contours is None or len(contours) == 0:
        raise ValueError("No contours found in the image. Ensure the input is a valid PNG.")

    # Create an SVG drawing with scaled size
    dwg = svgwrite.Drawing(output_svg_path, size=(width * scale_factor, height * scale_factor), profile='tiny')

    # Add contours to SVG with scaling
    for contour in contours:
        points = [(float(p[0][0]) * scale_factor, float(p[0][1]) * scale_factor) for p in contour]  # Scale coordinates
        if len(points) > 1:  # Ensure valid contours
            dwg.add(dwg.polyline(points, stroke="black", fill="none", stroke_width=1))

    # Save SVG file
    dwg.save()
    print(f"Conversion successful! SVG saved at: {output_svg_path}")


#-----------------Zina----------------------------------------
def svg_to_gcode(svg_file, output_file, scale=1, feedrate=1000):
    # Ensure absolute paths for cross-platform compatibility
    svg_file = os.path.abspath(svg_file)
    output_file = os.path.abspath(output_file)

    # Parse SVG paths
    paths, attributes = svgpathtools.svg2paths(svg_file)

    # Open the output file with UTF-8 encoding for macOS compatibility
    with open(output_file, 'w', encoding='utf-8') as gcode:
        gcode.write('G21 ; Set units to mm\n')
        gcode.write('G90 ; Absolute positioning\n')
        gcode.write('G1 Z5 F500 ; Move Z up\n')

        for path in paths:
            for segment in path:
                start = segment.start
                end = segment.end

                x1, y1 = start.real * scale, start.imag * scale
                x2, y2 = end.real * scale, end.imag * scale

                # Move to the start point of the segment
                gcode.write(f'G0 X{x1:.3f} Y{y1:.3f}\n')  # Fast move
                gcode.write('G1 Z0 F500\n')  # Lower the pen

                # Draw the segment
                gcode.write(f'G1 X{x2:.3f} Y{y2:.3f} F{feedrate}\n')

                # Lift the pen
                gcode.write('G1 Z5 F500\n')

        # Return to home position
        gcode.write('G1 Z5 F500 ; Lift pen\n')
        gcode.write('G0 X0 Y0 ; Return home\n')

    print(f'G-code saved at: {output_file}')

#-----------------Vova----------------------------------------
def render_text_to_gcode(text, x=0, y=0, font_size=20):
    surface = cairo.SVGSurface('/Users/lokaladmin/Downloads/sketchkey-app-2/src/output.svg', 200, 100)
    context = cairo.Context(surface)

    context.set_source_rgb(0, 0, 0)
    context.select_font_face('Tomatoes', cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD)
    context.set_font_size(font_size)

    context.move_to(x, y + font_size)
    context.show_text(text)

    surface.finish()
    print('SVG с текстом создан.')



class Plotter:
    def __init__(self, port):
        self.serial = serial.Serial(port, 115200, timeout=1)
        time.sleep(2)  # Ждем инициализации
        self.setup_machine()

    def setup_machine(self):
        ''' Настройки для плавного движения '''
        self.send_gcode('G21')  # Millimiteres
        self.send_gcode('G90')  # Absolute coordinates
        self.send_gcode('F1000')  # Basic speed

    def send_gcode(self, gcode):
        print(f'Sending: {gcode}')  # Logs
        self.serial.write((gcode + '\n').encode('utf-8'))
        time.sleep(0.05)  # Minimal latence without pauses

    def move_to(self, x, y):
        self.send_gcode(f'G1 X{x} Y{y} F1200')

    def pen_down(self):
        self.send_gcode('S1000 M3')
        time.sleep(0.2)  # Minimal latency for pen down

    def pen_up(self):
        self.send_gcode('S0 M5')
        time.sleep(0.2)  # Minimal latency for pen up

    def close(self):
        self.serial.close()



#-----------------Zina----------------------------------------
if __name__ == '__main__':
    if len(sys.argv) < 4:
        print('Usage: python script.py <text|sketch> <prompt> <style>')
        sys.exit(1)
    
    output = sys.argv[1].lower()  # e.g. 'text' or 'sketch'
    prompt = sys.argv[2]              # e.g. 'a small cottage by the lake'
    style = sys.argv[3].lower()       # e.g. 'flow'

    print(f'Style: {style}, output: {output}, prompt: {prompt}')
    if output == 'text':
        result = generate_response(prompt, style, output)
        print('Generated text:\n')
        print(result)
        render_text_to_gcode(result)

    elif output == 'sketch':
        result_file = generate_response(prompt, style, output)
        print(f'Image generated and saved to {result_file}')
        # Example usage
        png_to_svg('/Users/lokaladmin/Downloads/sketchkey-app-2/src/output.png','/Users/lokaladmin/Downloads/sketchkey-app-2/src/output.svg')
    else:
        print('Invalid output type. Use "text" or "sketch".')
        sys.exit(1)
    plotter = Plotter('/dev/tty.usbserial-1410')
    gcode_commands = svg_to_gcode('/Users/lokaladmin/Downloads/sketchkey-app-2/src/output.svg')
    for cmd in gcode_commands:
        plotter.send_gcode(cmd)
    
    plotter.pen_up()
    plotter.move_to(0,0)
    plotter.close()


