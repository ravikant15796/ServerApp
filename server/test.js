"use strict";

class Test {
   constructor(){
       console.log(this.test());
   }
   test(){
      return function(){
          return 5
      }
   }
}

new Test();
