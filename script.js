'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = ''; //.text.Content = 0
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  //NOTE use forEach for movenments-row
  movs.forEach(function (mov, i, arr) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    
    <div class="movements__value">${mov}</div>
  </div>`;

    //NOTE insert literal string to html, and position where we want to insert
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// displayMovements(account1.movements);

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} EURO`;
};
// calcDisplayBalance(account1.movements);

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes} euro`;

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)} euro`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposite => (deposite * acc.interestRate) / 100)
    //exclude element <1
    .filter((int, i, arr) => {
      console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest} euro`;
};
// calcDisplaySummary(account1.movements);

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsernames(accounts);
const updateUI = function (acc) {
  //display movements
  displayMovements(acc.movements);
  //display balance
  calcDisplayBalance(acc);
  //display summary
  calcDisplaySummary(acc);
};

//Event handler
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  //prevent form from submitting
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  // console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //display UI and welcome message
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //clear input field
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur(); // blur method
    //NOTE: we create a function call updateUI for calc accounts
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(+amount);
    //update userinterface
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    //add movement
    currentAccount.movements.push(amount);
    //update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    // console.log(index);
    //delete account
    accounts.splice(index, 1);
    // hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// let arr = ['a', 'b', 'c', 'd', 'e'];

// //slice method
// console.log(arr.slice(2)); // c d e
// console.log(arr.slice(2, 4)); // c d
// console.log(arr.slice(-2)); // d e
// console.log(arr.slice(-1)); // e
// console.log(arr.slice(1, -2)); //b c
// //copy shadow array
// console.log(arr.slice());
// console.log([...arr]);

// //splice
// // console.log(arr.splice(2));// c d e
// //console.log(arr);// a b

// arr.splice(-1);
// console.log(arr); //a b c d

// arr.splice(1, 2);
// console.log(arr); //a d

// //reverse , it change the original array
// arr = ['a', 'b', 'c', 'd', 'e'];
// const arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse());
// console.log(arr2);

// //concat, it doesnt change the original array
// const letters = arr.concat(arr2);
// console.log(letters);
// console.log([...arr, ...arr2]);

// //Join
// console.log(letters.join('-'));

// //NOTE looping array:  forEach
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// // for (const movement of movements) {
// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`Movement ${i + 1} You deposited ${movement}`);
//   } else {
//     console.log(`Movement ${i + 1} You withdrew ${Math.abs(movement)}`);
//   }
// }

// console.log('---FOR EACH----');
// movements.forEach(function (movement, i, arr) {
//   if (movement > 0) {
//     console.log(`Movement ${i + 1} You deposited ${movement}`);
//   } else {
//     console.log(`Movement ${i + 1} You withdrew ${Math.abs(movement)}`);
//   }
// });

// //forEach with map and set

// //with Map
// const currencie = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencie.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });

// //with set

// const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR']);
// console.log(currenciesUnique);
// currenciesUnique.forEach(function (value, _, map) {
//   console.log(`${key}: ${value}`);
// });

//CHALLENGE : array

const checkDogs = function (dogsJulia, dogsKate) {
  const dogsJualiaCorrected = dogsJulia.slice();
  //delete frist and two last element are not dogs
  dogsJualiaCorrected.splice(0, 1); //start from 0 and delete 1 element

  dogsJualiaCorrected.splice(-2); //delete 2 element from right to left
  console.log(dogsJualiaCorrected);
  //create aan array with julia and kate 's data
  const dogs = dogsJualiaCorrected.concat(dogsKate);
  console.log(dogs);
  //'Dog number 1 is aan adult, and is 5 year old' or a puppy ('dog number 2 is still a puppy')
  dogs.forEach(function (dog, i) {
    if (dog >= 3) {
      console.log(`Dog number ${i + 1} is an adult, and is ${dog} years old`);
    } else {
      console.log(
        `Dog number ${i + 1} is still a puppy, and is ${dog} years old`
      );
    }
  });
};
// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

//NOTE map method

const eurToUsd = 1.1;

const movementsUSD = movements.map(function (mov) {
  return mov * eurToUsd;
  // return 23;
});
console.log(movements);
console.log(movementsUSD);

const movementsUSDfor = [];
for (const mov of movements) movementsUSDfor.push(mov * eurToUsd);
console.log(movementsUSDfor);

const movementArrow = movements.map(mov => mov * eurToUsd);
console.log(movementArrow);

const movementDescription = movements.map(
  (mov, i) =>
    `movement ${i + 1}:  You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
      mov
    )}`
);
console.log(movementDescription);

//NOTE Filter method (condition)
const deposites = movements.filter(function (mov) {
  return mov > 0;
});
console.log(movements);
console.log(deposites);

//using with for  of
const depositeFor = [];
for (const mov of movements) if (mov > 0) depositeFor.push(mov);
console.log(depositeFor);

//small challenge
const withdrawals = movements.filter(mov => mov < 0);
console.log(withdrawals);

//NOTE reduce method
console.log(movements);
//accumulator -> snowball
const balance = movements.reduce(function (acc, cur, i, arr) {
  console.log(`Iteration ${i}: ${acc}`);
  return acc + cur;
}, 100);
console.log(balance);
//using arrow function
const balanceArrow = movements.reduce((acc, cur, i, arr) => acc + cur, 100);
console.log(balanceArrow);

//using for of
let balanceFor = 100; //inital value
for (const mov of movements) balanceFor += mov;
console.log(balanceFor);

//maximum value
const max = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]);
console.log(max);

//CHALLENGE array #2
const dogAges1 = [5, 2, 4, 1, 15, 8, 3];
// const dogAges1 = [5, 2, 2, 1];
const dogAges2 = [16, 6, 10, 5, 6, 1, 4];

const calcAverageHumanAge = function (age) {
  const human = age.map(dog => (dog <= 2 ? dog * 2 : 16 + dog * 4));
  const adults = human.filter(dog => dog >= 18);

  // const average = adults.reduce((dog, cur) => dog + cur, 0) / adults.length;
  const average = adults.reduce(
    (dog, cur, i, arr) => dog + cur / arr.length,
    0
  );
  return console.log(average);
};
calcAverageHumanAge(dogAges1);

//the magic of chaining method

//pipeline
const totalDepositsUSD = movements
  .filter(mov => mov > 0)
  .map(mov => mov * eurToUsd)
  .reduce((acc, mov) => acc + mov, 0);

console.log(totalDepositsUSD);

//CHALLENGE array #3 using arrow and chain
const calcAverageHu = function (age) {
  const humanAge = age
    .map(dog => (dog <= 2 ? dog * 2 : 16 + dog * 4))
    .filter(dog => dog > 18)
    .reduce((dog, cur, i, arr) => dog + cur / arr.length, 0);
  return console.log(humanAge);
};
calcAverageHu(dogAges1);

//The Find method
const firstWithdrawal = movements.find(mov => mov < 0);
console.log(movements);
console.log(firstWithdrawal); //return the first one element

console.log(accounts);
const accouts = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(accouts);

// for (const acc of accounts)
// if (acc.owner === 'Jesssica Davis') ;

//some and every
console.log(movements);

//check euqlity
console.log(movements.includes(-130)); //includes method to test the value in array
//check condition
console.log(movements.some(mov => mov === -130));
const anyDeposite = movements.some(mov => mov > 1500);
console.log(anyDeposite);

//every method return if all elements in array are satisfied the condition
console.log(movements.every(mov => mov > 0));
console.log(account4.movements.every(mov => mov > 0));

//separate callback
const deposit = mov => mov > 0;
console.log(movements);
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));

//flat and flat map
const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat()); //return an arr that joined all array inside

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(2)); //number of dept array

//NOTE take movements array in object in accounts array.
// const accountMovements = accounts.map(acc => acc.movements);
// console.log(accountMovements);
// const allMovements = accountMovements.flat();
// console.log(allMovements);
// const overalBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
//NOTE using pipeline method
const overalBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance);

//flatmap method is combine
const overalBalanceFlatMap = accounts
  .flatMap(acc => acc.movements)
  // .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(overalBalanceFlatMap);

//sort method

//Strings

const owners = ['Jonas', 'Zarch', 'Adam', 'Martha'];
console.log(owners.sort());

//Number
console.log(movements);
// console.log(movements.sort());

//return < 0 => A,B (keep order)
//return >0 => B,A (swithc order)
//ascending
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (b > a) return -1;
// });
movements.sort((a, b) => a - b);
console.log('ascending:', movements);

//decending
// movements.sort((a, b) => {
//   if (a > b) return -1;
//   if (b > a) return 1;
// });
movements.sort((a, b) => b - a);
console.log('descending:', movements);

//more way to create array

const x = new Array(7);
console.log(x);

//array practice
const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((sum, arr) => sum + arr, 0);
console.log(bankDepositSum);

//
// const numDeposits1000 = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov >= 1000).length;

const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  // .reduce((count, cur) => (cur >= 1000 ? count + 1 : count), 0);
  .reduce((count, cur) => (cur >= 1000 ? count++ : count), 0); //cant use ++ because preveous value is 0
console.log(numDeposits1000);
//prefixed ++operator
let a = 10;
console.log(a++);
console.log(++a);

//3.
// const sums = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sums, cur) => {
//       cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
//       return sums;
//     },
//     { deposits: 0, withdrawals: 0 }
//   );
// console.log(sums);

// const { deposits, withdrawals } = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sums, cur) => {
//       // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
//       sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
//       return sums;
//     },
//     { deposits: 0, withdrawals: 0 }
//   );
// console.log(deposits, withdrawals);

//CHALLENGE
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

//loop over the array to the object as a new property
dogs.forEach(dog => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));
console.log(dogs);
//find Sarah's dog and console it
const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(dogSarah);
console.log(
  `Sarah's dog is eating ${
    dogSarah.curFood > dogSarah.recFood ? 'too much' : 'too little'
  }`
);
//3.
const ownerEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recFood)
  .map(dog => dog.owners)
  .flat();
console.log(ownerEatTooMuch);

const ownerEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recFood)
  .flatMap(dog => dog.owners);
console.log(ownerEatTooLittle);

//4. log a string for each array created in abow
console.log(`${ownerEatTooMuch.join(' and ')}'s dogs eat too much`);
console.log(`${ownerEatTooLittle.join(' and ')}'s dogs eat too little`);
//5.
const exactlyEating = dogs.some(dog => dog.curFood === dog.recFood);
console.log(exactlyEating);
//6.
const checkEating = dog =>
  dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1;
console.log(dogs.some(checkEating));
//7.
console.log(dogs.filter(checkEating));
//8.
const dogCopySorted = dogs.slice().sort((a, b) => a.recFood - b.recFood);
console.log(dogCopySorted);
