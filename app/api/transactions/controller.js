const { Transaction, DetailTransaction, Book } = require('../../db/models');
const { Op } = require('sequelize');

module.exports = {
  getTransactionList: async (req, res, next) => {
   try{
      const { keyword =''} = req.query;

      let condition = {
          user : req.user.id,
      };

      if(keyword !== ''){
          condition = { ...condition, invoice: { [Op.like]: `%${keyword}%`  }};
      }


      const transactions = await Transaction.findAll({
          where: condition,
          include: {
              model: DetailTransaction,
              as: 'detailTransaction'
          }
      });

      res.status(200).json({
          message: 'success get all transactions',
          data : transactions
      })
    } catch (err) {
      next(err);
    }
  },

  detailTransactionList: async (req, res, next) => {
    try{
       const { id } = req.params;
 
       const detailTransaction = await Transaction.findOne({
           where: {id :id},
           include: {
               model: DetailTransaction,
               as: 'detailTransaction'
           }
       });
 
       res.status(200).json({
           message: 'success get detail transactions',
           data : detailTransaction
       })
     } catch (err) {
       next(err);
     }
   },
};
