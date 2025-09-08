# Warframe Fashion Finder

A web-based tool designed to help Warframe players create stunning and harmonious color schemes for their Warframes. This application provides a suite of tools to select, match, and generate color palettes, making it easier than ever to find the perfect look.

**Live Demo:** [https://wffinder.netlify.app/](https://wffinder.netlify.app/)

## About The Project

This project's goal was to create a powerful yet easy-to-use tool that simplifies the process of color customization in the game. By leveraging advanced color theory and the comprehensive CIEDE2000 color difference algorithm, the Fashion Finder provides accurate and aesthetically pleasing color suggestions.

## Features

- **Color Selection**: Choose a base color using a visual color picker, or input values directly in HEX, RGB, or HSL formats.
- **Palette Matching**: Instantly find the closest matching colors from Warframe's extensive collection of in-game color palettes.
- **Color Harmonies**: Generate classic color harmonies such as Complementary, Monochromatic, Analogous, Triadic, and Tetradic.
- **Shades, Tints, & Tones**: Explore variations of your base color by generating shades, tints, and tones.
- **Fashion Generation**: Get inspired with the "Generate Fashion" feature, which creates unique color palettes based on styles like Modern, Retro, Cyberpunk, and more.
- **Warframe Color Slots**: Assign your chosen colors to specific Warframe color slots (Primary, Secondary, Tertiary, Accents, etc.) to visualize your final look.
- **Palette Filtering**: Filter the available in-game palettes to narrow down your search and focus on the palettes you own.
- **Interactive UI**: A sleek and responsive user interface that makes exploring and selecting colors a breeze.

## How To Use

1.  **Select a Base Color**: Use the color picker or enter a color code to choose your starting color.
2.  **Find Matches**: The app will automatically find the closest in-game colors. Click on a swatch to see its full palette.
3.  **Explore Harmonies**: Navigate through the "Classic Combinations" and "Shades, Tints, & Tones" tabs to discover new color relationships.
4.  **Generate Fashion**: Use the "Generate Fashion" tab for more complex and stylized palette suggestions.
5.  **Build Your Look**: Click the `+` icon on any color swatch to add it to a specific Warframe color slot.

## Technologies Used

- **HTML5**: For the structure and content of the web app.
- **CSS3**: For styling the user interface, including custom scrollbars, transitions, and a responsive grid layout.
- **JavaScript (ES6+)**: For all the application logic, including color calculations, DOM manipulation, and event handling.
- **CIEDE2000**: The color difference algorithm used for accurately comparing colors and finding the closest matches.

## Project Structure

```
/
├── index.html            # The main HTML file
├── style.css             # All styles for the application
├── script.js             # Core application logic and interactivity
└── data/
    ├── palettes.js       # Contains the Warframe color palette data
    └── ...               # Favicons and other site assets
```

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
