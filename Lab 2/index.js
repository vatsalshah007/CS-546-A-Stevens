const array = require("./arrayUtils");
const string = require("./stringUtils");
const object = require("./objUtils");


//////////////// ARRAY UTILS //////////////// 
// Average Tests
try {
    // Should Pass
    let average1 = array.average([[1], [2], [3]]); // Returns: 2
    console.log(average1);
   //  console.log('mean passed successfully');
 } catch (e) {
    console.error('mean failed test case');
 }
 try {
    // Should Fail
    let average3 = array.average(undefined); // throws an error 
    console.error('mean did not error');
 } catch (e) {
    console.log('mean failed successfully');
 }

// ModeSquared Tests
try {
   // Should Pass
   let modeSquared = array.modeSquared([1, 2, 3, 3, 4]); // Returns: 9
   console.log(modeSquared);   
} catch (e) {
   console.log("Mode Squared failed to pass");
}
try {
   // Should Fail
   let modeSquared = array.modeSquared([]) // throws an error
   console.log("Median didn't error");  
} catch (e) {
   console.log("Mode Squared failed successfully");
}

// MedianElement Tests
try {
   // Should Pass
   // let median1 = array.medianElement([5, 6, 7])
   let median1 = array.medianElement([1, 2, 4, 2, 3, 3])
   console.log(median1);
   // console.log("Median Passed Successfully");
} catch (e) {
   console.log("Median failed to Pass");
}
try {
   // Should Fail
   let median3 = medianElement([]); // throws error
   console.log("Median didn't error");
} catch (e) {
   console.log("Median failed successfully");
}

//  Merge Tests
try {
   // Should Pass
   let merge1 = array.merge([1, 2, 3], [3, 1000, 2]); // Returns: [1,1,2,2,3,3]
   console.log(merge1);
   // console.log("Merge passed successfully"); 
} catch (e) {
   console.log("Merge failed to pass");
}
try {
   // Should Fail
   let merge3 = array.merge([null, null, null], [null, null, null]); // throws
   console.log("Merge didn't error"); 
} catch (e) {
   console.log("Merge failed successfully");
}


//////////////// STRING UTILS ////////////////
// Sort Tests
try {
   // Should Pass
   let sort1 = string.sortString("123 foo BAR")
   console.log(sort1);
} catch (e) {
   console.log("sort failed to pass");
}
try {
   // Should Fail
   let sort1 = string.sortString(); // Throws Error
   console.log("sort didn't error"); 
} catch (e) {
   console.log("sort failed successfully");
}

// Replace Char Tests
try {
   // Should Pass
   let replaceChar = string.replaceChar("robjacobback", 2)
   console.log(replaceChar);
} catch (e) {
   console.log("replaceChar failed to pass");
}
try {
   // Should Fail
   let replaceChar = string.replaceChar("foobar", 10); // Throws Error 
   console.log("replaceChar didn't error"); 
} catch (e) {
   console.log("replaceChar failed successfully");
}

// Mash Up Tests
try {
   // Should Pass
   let mashUp = string.mashUp("Patrick", "Hill", "$"); //Returns "PHaitlrli$c$k$"
   console.log(mashUp);
} catch (e) {
   console.log("mashUp failed to pass");
}
try {
   // Should Fail
   let mashUp = string.mashUp("Patrick", ""); //Throws error
   console.log("mashUp didn't error"); 
} catch (e) {
   console.log("mashUp failed successfully");
}

//////////////// OBJECT UTILS ////////////////  
// Compute Objects Tests
try {
   // Should Pass
   const first = { x: 2, y: 3};
   const second = { a: 70, x: 4, z: 5 };
   const third = { x: 0, y: 9, q: 10 };
   const firstSecondThird = object.computeObjects([first, second, third], x => x * 2);
   console.log(firstSecondThird); //{ x: 12, y: 6, a: 140, z: 10 }
} catch (e) {
   console.log("Compute Objects failed to pass");
}
try {
   // Should Fail
   const first = {undefined};
   const second = { a: 70, x: 4, z: 5 };
   const third = { x: 0, y: 9, q: 10 };
   const firstSecondThird = object.computeObjects([first, second], x => x * 2);
   console.log("Compute Objects didn't error");
} catch (e) {
   console.log("Compute Objects failed successfully");
}

// Common Keys Tests
try {
   // Should Pass
   const first = {a: 2, b: 4};
   const second = {a: 5, b: 4};
   const third = {a: 2, b: {x: 7, y: { k: 10}, z: 5}};
   const fourth = {a: 3, b: {x: 7, y: { k: 10}}};
   const fifth = { a: 1, b: { x: 10 }, c: {} }
   const sixth = { a: 2, b: { x: 9, y: 9 }, c: {} }
   console.log(object.commonKeys(first, second)); // {b: 4}
} catch (e) {
   console.log("Common keys failed to pass");
}

try {
   // Should Fail
   const first = [];
   const second = {a: 5, b: 4};
   const third = {a: 2, b: {x: 7, y: { k: 10}, z: 5}};
   const fourth = {a: 3, b: {x: 7, y: { k: 10}}};
   const fifth = { a: 1, b: { x: 10 }, c: {} }
   const sixth = { a: 2, b: { x: 9, y: 9 }, c: {} }
   console.log(object.commonKeys(first, second)); // {b: 4}
   console.log("Common Keys didn't Error");
} catch (e) {
   console.log("Common Keys Failed successfully");
}

// Flip Objects Test
try {
   // Should Pass
   console.log(object.flipObject({ a: 3, b: {d: 5}, c: [5, 6] })); // Returns:{ '3': 'a', '5': 'c', '6': 'c', b: { '5': 'd' } }
} catch (e) {
   console.log("Flip Objects failed to pass");
}

try {
   // Should Fail
   console.log(object.flipObject({}));
   console.log("Flip Objects didn't error");
} catch (e) {
   console.log("Flip Objects failed successfully");
}


