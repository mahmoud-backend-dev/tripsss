const isAdmin = require("../../middleware/isAdmin");
const { cardPayment } = require("../../utils/paymob");
const express = require("express"),
  client = require("../../db/db"),
  validateOrder = require("../../models/order"),
  isUser = require("../../middleware/isUser"),
  router = express.Router();

//  router.post("/",isUser,async(req,res)=>{
//     try {
//         const { error } = validateOrder(req.body);
//         if (error) return res.status(404).json({ msg: error.details[0].message });

//         let {user_id,
//             name,
//             trip_id,
//             number_of_person,
//             arrivaldate,
//             departuredate,
//             flight_number,
//             hotel_name,
//             room_name
//         } =req.body ;

//       let result = await client.query("SELECT * FROM insert_order($1,$2,$3,$4,$5,$6,$7,$8,$9);",[user_id,name,trip_id,number_of_person,arrivaldate,departuredate,flight_number,hotel_name,room_name])
//        let order_id =  result.rows[0].inserted_id;

//        let totalMony = getTotal(order_id,user_id);

//       let obj = await cardPayment({name:name},totalMony);
//       console.log(obj);
//      res.json(WebGLVertexArrayObject);

//     } catch (error) {
//         return res.status(404).json({ msg: error.message });
//     }
//  })
router.post("/", isUser, async (req, res) => {
  try {
    const { error } = validateOrder(req.body);
    if (error) return res.status(400).json({ msg: error.details[0].message });

    const {
      user_id,
      name,
      trip_id,
      number_of_person,
      arrivaldate,
      departuredate,
      flight_number,
      hotel_name,
      room_num,
    } = req.body;

    const result = await client.query(
      "SELECT * FROM insert_order($1,$2,$3,$4,$5,$6,$7,$8,$9);",
      [
        user_id,
        name,
        trip_id,
        number_of_person,
        arrivaldate,
        departuredate,
        flight_number,
        hotel_name,
        room_num,
      ]
    );
    const order_id = result.rows[0].insert_order;

    // Assuming getTotal function is defined elsewhere

    console.log(order_id);
    const totalMoney = (await getTotal(order_id, user_id)) * 100;

    const {url,orderId} = await cardPayment(
      { name: name, amount: totalMoney, order_id },
      totalMoney
    );
    console.log(orderId);
    await client.query("UPDATE orders SET o_id = $1 WHERE id = $2 ;",[orderId,order_id]);
    res.json({ url });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: error.message });
  }
});

async function paid(id) {
  try {
    await client.query("CALL paid_order($1);", [id]);
  } catch (error) {
    return Error(error.message);
  }
}

//  that api take order id and it  make it paid

router.put("/:id", async (req, res) => {
  try {
    await paid(req.params.id);
    res.json({ msg: "order Paid Successfully" });
  } catch (error) {
    return res.status(404).json({ msg: error.message });
  }
});

async function getTotal(o_id, u_id) {
  try {
    let result = await client.query("SELECT * FROM check_total ($1,$2);", [
      u_id,
      o_id,
    ]);
    let total = result.rows[0].check_total;
    return total;
  } catch (error) {
    throw error;
  }
}

router.post("/check/:orderId", isUser, async (req, res) => {
  try {
    let order_id = req.params.orderId;
    let user_id = req.body.user_id;
    let total = await getTotal(order_id, user_id); // Await here to get the result
    res.json({ total: total }); // Sending total as response
  } catch (error) {
    return res.status(404).json({ msg: error.message });
  }
});

router.get("/", isAdmin, async (req, res) => {
  try {
    let result = await client.query("SELECT * FROM get_paid_orders();");
    res.json({ data: result.rows });
  } catch (error) {
    return res.status(404).json({ msg: error.message });
  }
});

router.delete("/:id", isAdmin, async (req, res) => {
  try {
    let id = req.params.id;
    await client.query("CALL delete_order($1);", [id]);
    res.json({ msg: "order deleted" });
  } catch (error) {
    return res.status(404).json({ msg: error.message });
  }
});




router.post('/state', isUser, async (req, res) => {
  /**
   * id The ID of this transaction
   * success Payment successfully or not
   * pending Payment finished or not
   * amount_cents that was paid to this transaction الفلوس الى ادفعت 
   */

  // 

  const {
    success,
    pending,
    amount_cents,
    order = {} } = req.obj;
  if (success && !pending) {
    
    let total= await check_total_paid(order.id) ;  //  return the money  must paid 


    if(amount_cents >= total) {
      await paid(order.id) ;
      res.send("done");
    }
    else 
    {
        res.status(404).json({msg:"not enough money "});
    }

  }
})






async function check_total_paid (o_id)
{
  try {
    let result = await client.query("SELECT * FROM check_total_p($1);", [o_id ]);
    let total = result.rows[0].check_total_p;
    return total;
  } catch (error) {
    throw error;
  }
}



module.exports = router;
