import _ from 'lodash';

// function removeItemFromCurrentOrder(currentOrderItems, item) {
//   const indexOfItem = currentOrderItems.indexOf(item);
//   return currentOrderItems.splice(indexOfItem, 1);
// }

function addProductVariationToCurrentOrder(currentOrderItems, product, variation, qty) {
  //
  const newOrderItem = {
    product: product,
    variation: variation,
    qty: qty,
    lineTotal: qty * variation.price,
  };

  const isDuplicate = _.findIndex(currentOrderItems, (item) => {
    // Check if product and variation exists in the order already
    if (item.product._id == product._id && item.variation._id == variation._id) return true;
  });

  if (isDuplicate < 0) {
    // If it is not duplicate, then return the updated orderItems arrays
    return _.concat(currentOrderItems, newOrderItem);
    //
  } else {
    // If it is duplicate, then only update the quantity and line total for the duplicate line
    let duplicateOrder = Array.from(currentOrderItems);
    duplicateOrder[isDuplicate].qty += qty;
    duplicateOrder[isDuplicate].lineTotal += newOrderItem.lineTotal;
    return duplicateOrder;
  }
}

function updateProductVariationOfCurrentOrder(currentOrderItems, orderItemToChange, newVariation, newQty) {
  //

  const orderItemInArray = _.findIndex(currentOrderItems, (item) => {
    // Check if product and variation exists in the order already
    if (item.product._id == orderItemToChange.product._id && item.variation._id == orderItemToChange.variation._id) return true;
  });

  let updatedOrder = Array.from(currentOrderItems);
  updatedOrder[orderItemInArray].variation = newVariation;
  updatedOrder[orderItemInArray].qty = newQty;
  updatedOrder[orderItemInArray].lineTotal = newQty * newVariation.price;

  // AFTER CHANGING THE VARIATION OF A PRODUCT, IT MIGHT BE DUPLICATED IN THE ORDER ALREADY.
  // THIS FUNCTION IS TO COMBINE BOTH ORDER ITEMS INTO JUST ONE (SUM OF QUANTITY AND LINE TOTAL)
  // const duplicateItemInCurrentOrder = _.filter(
  //   _.uniq(
  //     _.map(currentOrderItems, function (item) {
  //       if (
  //         _.filter(currentOrderItems, (item) => {
  //           // Check if product and variation exists in the order already
  //           if (item.product._id == orderItemToChange.product._id && item.variation._id == orderItemToChange.variation._id) return true;
  //         }).length > 1
  //       ) {
  //         return item;
  //       }

  //       return false;
  //     })
  //   ),
  //   function (value) {
  //     return value;
  //   }
  // );

  // console.log(duplicateItemInCurrentOrder);

  // if (duplicateItemInCurrentOrder.length) {
  //   duplicateItemInCurrentOrder.forEach((duplicate) => {});
  // }

  return updatedOrder;
}

function removeItemFromCurrentOrder(currentOrderItems, item) {
  return _.pull(currentOrderItems, item);
}

function calculateOrderTotals(currentOrderItems, currentOrderDiscounts) {
  //
  // Subtotal
  let subtotal = 0;
  currentOrderItems.forEach((line) => {
    subtotal += line.lineTotal;
  });

  // Check discounts
  let discounts = 0;
  // console.log(currentOrderDiscounts);
  currentOrderDiscounts.forEach((discount) => {
    // console.log(discount.amount);
    discounts += discount.amount;
  });

  // Calculate Final Amount
  let total = subtotal - discounts;
  if (total < 0) total = 0;

  return {
    subtotal,
    discounts,
    total,
  };
}

function getValidDiscountsForCurrentOrder(currentOrderItems, discounts) {
  //

  let expandedOrderItems = [];
  currentOrderItems.forEach((line) => {
    for (let index = 0; index < line.qty; index++) {
      expandedOrderItems.push(line);
    }
  });

  let validDiscounts = [];

  let loop = expandedOrderItems.length + 1;

  while (loop) {
    discounts.forEach((discount) => {
      if (discount.rules.length) {
        //
        let testResultsForEachANDRule = [];

        discount.rules.forEach((setOfProductVariationsThisOrderMustContain) => {
          let testResultsForEachORRule = [];
          setOfProductVariationsThisOrderMustContain.forEach((variationId) => {
            //
            // Check if the current variationId matches any of the order items
            const result = _.find(expandedOrderItems, (item) => {
              return item.id == variationId;
            });

            testResultsForEachORRule.push(result);
          });
          testResultsForEachANDRule.push(testResultsForEachORRule);
        });

        // Return true if every element of array is true
        let discountApplies = testResultsForEachANDRule.every((ANDrule) => {
          return ANDrule.some((ORrule) => {
            return ORrule;
          });
        });

        if (discountApplies) {
          testResultsForEachANDRule.forEach((ANDrule) => {
            // Compact remove all falsy value from the array, so we get only the elements that matched order items
            // Only remove one of the order elements. If an OR rule has 3 ids, we just want to remove one of them,
            // even though the 3 might all be present in the order
            const index = _.indexOf(expandedOrderItems, _.compact(ANDrule)[0]);
            if (index > -1) expandedOrderItems.splice(index, 1); // 2nd parameter means remove one item only
          });
          validDiscounts.push(discount);
        }
        //
      }
    });

    loop--;
  }

  return validDiscounts;
}

const orderManager = {
  addProductVariationToCurrentOrder,
  updateProductVariationOfCurrentOrder,
  removeItemFromCurrentOrder,
  calculateOrderTotals,
  getValidDiscountsForCurrentOrder,
};

export default orderManager;
