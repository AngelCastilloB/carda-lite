import { Component } from '@angular/core';
import { WalletService } from './services/wallet.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'carda-lite';

    /**
   * Initiaize a new instance of the WalletService class.
   */
     constructor(_walletService: WalletService)
     {
       let seed = _walletService.createSeedPhrases();
        console.log(seed);

        console.log(_walletService.create(seed));
     }
   
}
