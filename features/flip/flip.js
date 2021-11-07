const Flip = {
     data() {
          return {
               // buy
               buy_price_main: 0,
               buy_main_setupFee: 0,
               main_count: 0,
               main_total: 0,
               isBuyOrderMain: false,
               
               // sell
               sell_price: 0,
               total_sell_price: 0,
               finalSellPrice: 0,
               sell_market_tax: 0,
               sell_setupFee: 0,
               hasProfit: false,
               total_cost: 0,
               profit: 0,

               // configs
               premiumActive: false,
               marketTaxPerc: 6,
               setupFeePerc: 1.5
          }
     },

     mounted() {
          this.loadVars();
          this.calculateProfit();
     },

     methods: {
          calculateProfit() {
               this.saveVars();
               this.marketTaxPerc = this.premiumActive ? 3 : 6;
               this.getTotalMainCost();
               this.getSellOrderTax();
               if (!this.buy_price_main || !this.sell_price)
                    return;

               this.total_cost = this.main_total;
               this.profit = this.finalSellPrice - this.total_cost;
               this.hasProfit = this.profit > 0;
          },

          saveVars() {
               const enchantValues = {
                    buy_price_main: this.buy_price_main,
                    main_count: this.main_count,
                    isBuyOrderMain: this.isBuyOrderMain,
                    sell_price: this.sell_price,
                    premiumActive: this.premiumActive
               };
               localStorage.setItem("flip", JSON.stringify(enchantValues));
          },

          loadVars() {
               const enchantValues = JSON.parse(localStorage.getItem("flip"));
               if (!enchantValues)
                    return;
                    
               // * 1 to convert from string to number
               this.buy_price_main = enchantValues.buy_price_main;
               this.main_count = enchantValues.main_count;
               this.sell_price = enchantValues.sell_price;
               // bools
               this.isBuyOrderMain = enchantValues.isBuyOrderMain
               this.premiumActive = enchantValues.premiumActive
               this.marketTaxPerc = enchantValues.premiumActive ? 3 : 6;
          },

          getTotalMainCost() {
               this.buy_price_main_total_notax = this.main_count * this.buy_price_main;
               this.buy_main_setupFee = this.isBuyOrderMain ? this.getPercentOf(this.buy_price_main_total_notax, this.setupFeePerc) : 0;
               this.main_total = this.buy_price_main_total_notax + this.buy_main_setupFee
          },

          getSellOrderTax() {
               this.total_sell_price = this.sell_price * this.main_count;
               this.sell_market_tax = this.getPercentOf(this.total_sell_price, this.marketTaxPerc);
               this.sell_setupFee = this.getPercentOf(this.total_sell_price, this.setupFeePerc);
               this.finalSellPrice = this.total_sell_price - this.sell_market_tax - this.sell_setupFee;
          },

          getPercentOf(target, percent) {
               return target * percent / 100;
          }
     }
};

Vue.createApp(Flip).mount("#flip");