using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EPOS_Integration.ITB
{
    public class ITBModel
    {
       
    }
    public class SALES_DATA_HEADER_LIST
    {
        public string Primary_Key { get; set; }
        public int Row_ID { get; set; }
        public int CheckID { get; set; }
        public string CheckNo { get; set; }
        public DateTime TransactionDate { get; set; }
        public DateTime OpenTime { get; set; }
        public DateTime CloseTime { get; set; }
        public int StoreNo { get; set; }
        public string StoreName { get; set; }
        public string TableName { get; set; }
        public string ServerName { get; set; }
        public string PLU { get; set; }
        public string ItemName { get; set; }
        public decimal Quantity { get; set; }
        public decimal OrigPrice { get; set; }
        public decimal SellPrice { get; set; }
        public int Level1CatID { get; set; }
        public string Level1Cat { get; set; }
        public int Level2CatID { get; set; }
        public string Level2Cat { get; set; }
        public int DeptNo { get; set; }
        public string DeptName { get; set; }
        public string HH { get; set; }
        public string PromoName { get; set; }
        public decimal PromoAmt { get; set; }
        public string PromoByNo { get; set; }
        public string PromoByName { get; set; }
        public int Settled { get; set; }
        public int voided { get; set; }
        public string voidReason { get; set; }
        public string TimeStamp { get; set; }
        public string DateStamp { get; set; }
        public decimal Tax { get; set; }
        public decimal ServiceCharge { get; set; }
        public int IsCombo { get; set; }
        public int ComboID { get; set; }
        public string code { get; set; }
    }
    public class ROOT_SALES_DATA_HEADER
    {
        public List<SALES_DATA_HEADER_LIST> EventList { get; set; }
    }
    public class PAYMENT_DATA_LIST
    {
        public int CheckID { get; set; }
        public string CheckByteNo { get; set; }
        public DateTime TransactionDate { get; set; }
        public int StoreNo { get; set; }
        public int DeptNo { get; set; }
        public string DeptName { get; set; }
        public string EmpNumber { get; set; }
        public string FirstName { get; set; }
        public int PayID { get; set; }
        public string PayType { get; set; }
        public string Xref { get; set; }
        public string PaymentName { get; set; }
        public decimal TipAmt { get; set; }
        public decimal PayAmt { get; set; }
        public int Covers { get; set; }
        public string Posted { get; set; }
        public string Reference { get; set; }
        public string AuthNo { get; set; }
        public DateTime ExpiryDate { get; set; }
        public int FCovers { get; set; }
        public string CardNo { get; set; }
        public string FreqDiner { get; set; }
        public string PaymentDate { get; set; }
        public string paymentTime { get; set; }
        public string code { get; set; }
    }
    public class ROOT_PAYMENT_DATA_LIST
    {
        public List<PAYMENT_DATA_LIST> EventList { get; set; }
    }
}
