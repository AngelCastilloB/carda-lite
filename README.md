
# CardaLite
[![build status](https://github.com/AngelCastilloB/carda-lite/workflows/Build/badge.svg)](https://github.com/AngelCastilloB/carda-lite::wq
/actions)

A very simple Cardano wallet written in TypeScript using Angular 13.

The application uses the [Cardano Serialization Lib](https://github.com/emurgo/cardano-serialization-lib) to create and sign transactions and [Blockfrost](https://blockfrost.io/) to interact with the blockchain (Query address, TXs, UTXOs and to submit transactions to the blockchain).

For simplicity sake this application only work with the first derived payment address (single address mode similar to some browser wallets), also, the wallet only work with ADA (native assets are ignored, however they are taken into account correctly when building transactions).

With this application you can:

- Create new wallets using BIP39 mnemonic codes.
- Import wallets using BIP39 mnemonic codes.
- See your receiving address (derived from the mnemonic codes. This is always the first derived payment key).
- See your total balanace (in ADA).
- See the latest 100 transactions made with the wallet payment key.
- Send ADA to other wallets.

## Conventions

### File System Structure Inside Projects

 * All folders should be lower case with "-" character as word separator.
 * All parts of the components should be name as follows name.component.ts|html|css|spec to represent those various files.
 * All components should have its own folder.
    * The following structure must be followed inside the "client" folder:
    ```
    app
    ├── components
    ├── pipes
    ├── services
    └── vendors
    ```
### Object Oriented Programming

 * Abstract class should have the 'Abstract' prefix, IE: AbstractVehicle instead of Vehicle.
 * Interfaces should have the letter 'I' as prefix, IE: IDevice, IXmlSerializable, ICommand.
 * Methods should be named after an action, IE: getTime() instead of time().
 * Methods that return flags or booleans should answer to questions IE: isAdmin()
 
### JavaScript

 * Prefer array helpers (forEach, map, filter, find, every/some, reduce) over manual iteration using for or while loops.
 * When you must use function expressions (as when passing an anonymous function), prefer the arrow function notation. 
 * Always use class. Avoid manipulating prototype directly.
 * Don't use generators for now. (They don't transpile well to ES5).
 * Prefer object destructuring over directly accessing and using multiple properties of an object.
 * Prefer array destructuring over directly referencing elements on the array.
 * Prefer object destructuring for multiple return values over array destructuring.

### Version control agreements

 * Commit often.
 * Use [Semantic Commit Messages](https://sparkbox.com/foundry/semantic_commit_messages)
 * Use Git branch naming and branch merging conventions:
     Release preparation branches must start with "release/".
     Feature, Issues, Bug branches must start with "feature/".
     Hotfix branches must start with "hotfix/".

## Environment

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Test coverages

Run `ng test --code-coverage` to execute the unit tests via [Karma](https://karma-runner.github.io). A report will be generated at "coverage/index.html"
