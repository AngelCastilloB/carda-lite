import { Component } from '@angular/core';
import { WalletService } from './services/wallet.service'
import { BlockfrostService } from './services/blockfrost.service';

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
     constructor(_walletService: WalletService, _blockfrostService: BlockfrostService)
     {
       let seed = _walletService.createSeedPhrases();
        console.log(seed);

        console.log(_walletService.create("ginger tobacco ignore sheriff jelly clean leisure century cheese light lend attitude quality blur cage outer census earn visual hour leader special budget logic"));
        _blockfrostService.getLatestProtocolParameters().subscribe((x)=> console.log(x));

        _blockfrostService.getAddressUtxos("addr_test1qp8x8l9ldlmhf5s285fa2g74k0wfjskqztvqw7vda2x54qzwa5e343pw7w8d2d3sqh4uv7303r29mugnlj6uewhrcyvqr20x50").subscribe((x)=> console.log(x));
        _blockfrostService.getAddressBalance("addr_test1qp8x8l9ldlmhf5s285fa2g74k0wfjskqztvqw7vda2x54qzwa5e343pw7w8d2d3sqh4uv7303r29mugnlj6uewhrcyvqr20x50").subscribe((x)=> console.log(x));
        _blockfrostService.getTransactions("addr_test1qp8x8l9ldlmhf5s285fa2g74k0wfjskqztvqw7vda2x54qzwa5e343pw7w8d2d3sqh4uv7303r29mugnlj6uewhrcyvqr20x50").subscribe((x)=> console.log(x));

     }
   
}
