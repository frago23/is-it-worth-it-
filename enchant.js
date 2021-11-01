const Enchant = {
     data() {
          return {
               buy_price_main: 0,
               buy_price_main_total_notax: 0,
               runes_needed: 0,
               isBuyOrderMain: false,
               main_count: 1,
               main_total: 0,

               buy_price_rune: 0,
               buy_price_rune_total_notax: 0,
               rune_number: 0,
               rune_total_cost: 0,
               isBuyOrderRune: false,

               sell_price: 0,
               total_sell_price: 0,
               finalSellPrice: 0,

               profit: 0,
               hasProfit: false,
               total_cost: 0,

               buy_main_setupFee: 0,
               buy_rune_setupFee: 0,
               sell_market_tax: 0,
               sell_setupFee: 0,

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
               this.getTotalRuneCost();
               this.getSellOrderTax();
               if (!this.buy_price_main || !this.buy_price_rune || !this.sell_price)
                    return;

               this.total_cost = this.main_total + this.rune_total_cost;
               this.profit = this.finalSellPrice - this.total_cost;
               this.hasProfit = this.profit > 0;
          },

          saveVars() {
               localStorage.setItem('buy_price_main', this.buy_price_main);
               localStorage.setItem('main_count', this.main_count);
               localStorage.setItem('runes_needed', this.runes_needed);
               localStorage.setItem('isBuyOrderMain', this.isBuyOrderMain);
               localStorage.setItem('isBuyOrderRune', this.isBuyOrderRune);
               localStorage.setItem('sell_price', this.sell_price);
               localStorage.setItem('premiumActive', this.premiumActive);
          },

          loadVars() {
               // * 1 to convert from string to number
               this.buy_price_main = localStorage.getItem('buy_price_main') * 1;
               this.main_count = localStorage.getItem('main_count') * 1;
               this.runes_needed = localStorage.getItem('runes_needed') * 1;
               this.sell_price = localStorage.getItem('sell_price') * 1;
               // bools
               this.isBuyOrderMain = localStorage.getItem('isBuyOrderMain');
               this.isBuyOrderRune = localStorage.getItem('isBuyOrderRune');
               this.premiumActive = localStorage.getItem('premiumActive');
          },

          getTotalMainCost() {
               this.buy_price_main_total_notax = this.main_count * this.buy_price_main; 
               this.buy_main_setupFee = this.isBuyOrderMain ? this.getPercentOf(this.buy_price_main_total_notax, this.setupFeePerc) : 0;
               this.main_total = this.buy_price_main_total_notax + this.buy_main_setupFee 
          },

          getTotalRuneCost() {
               this.rune_number = this.runes_needed * this.main_count;
               this.buy_price_rune_total_notax = this.rune_number * this.buy_price_rune;
               this.buy_rune_setupFee = this.isBuyOrderRune ? this.getPercentOf(this.buy_price_rune_total_notax, this.setupFeePerc) : 0;
               this.rune_total_cost = this.buy_price_rune_total_notax + this.buy_rune_setupFee;
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

Vue.createApp(Enchant).mount("#enchant")