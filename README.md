# sfz-syntax-highlighters
![Release](https://github.com/kmturley/sfz-syntax-highlighters/workflows/Release/badge.svg)

Auto-generation of sfz syntax highlighters for code editors:

* NodeJS 16.x
* TypeScript 4.x


## Installation

Install dependencies using:

    npm install


## Usage

Run the development server using:

    npm run dev

Create a build using:

    npm run build

View built files at:

    ./out

Diff built files in VSCode:

    npm run diff:gedit
    npm run diff:vscode

Run built files in the target code editor:

    npm run test:gedit
    npm run test:vscode


## Deployment

Release an updated version on GitHub by simply creating a version tag:

    npm version patch
    git push && git push origin --tags

This will run an automated build and deploy process on GitHub Actions:

    .github/workflows/release.yml


## Contact

For more information please contact kmturley
