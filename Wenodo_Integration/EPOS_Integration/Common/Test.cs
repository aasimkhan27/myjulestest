using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EPOS_Integration.Common
{



    // Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse);
 



  

   



  

 

  
    public class Model
    {
        public bool isClosed { get; set; }
        public string period { get; set; }
        public string from { get; set; }
        public string to { get; set; }
        public string paymentDate { get; set; }       
        public double employerNi { get; set; }
        public double employerPensionContribs { get; set; }
        public string note { get; set; }



        public Employee employee { get; set; }
        public HmrcDetails hmrcDetails { get; set; }
        public PayOptions payOptions { get; set; }
        public Totals totals { get; set; }
        public TotalsYtd totalsYtd { get; set; }
        public List<Line> lines { get; set; }
    }

    public class Employee
    {
        public string id { get; set; }
        public string name { get; set; }
        public string url { get; set; }
    }

    public class HmrcDetails
    {
        public string officeNumber { get; set; }
        public string payeReference { get; set; }
        public string accountsOfficeReference { get; set; }
        public int apprenticeshipLevyAllowance { get; set; }
        public bool quarterlyPaymentSchedule { get; set; }
        public bool includeEmploymentAllowanceOnMonthlyJournal { get; set; }
        public bool carryForwardUnpaidLiabilities { get; set; }
    }

    public class PayOptions
    {
        public string period { get; set; }
        public int ordinal { get; set; }
        public double payAmount { get; set; }
        public string basis { get; set; }
        public bool nationalMinimumWage { get; set; }
        public int payAmountMultiplier { get; set; }
        public double baseHourlyRate { get; set; }
        public int baseDailyRate { get; set; }
        public bool autoAdjustForLeave { get; set; }
        public string method { get; set; }
        public bool withholdTaxRefundIfPayIsZero { get; set; }

        public TaxAndNi taxAndNi { get; set; }
        public FpsFields fpsFields { get; set; }
        public List<RegularPayLine> regularPayLines { get; set; }
    }


    public class TaxAndNi
    {
        public string niTable { get; set; }
        public bool secondaryClass1NotPayable { get; set; }
        public bool postgradLoan { get; set; }
        public string studentLoan { get; set; }
        public string taxCode { get; set; }
        public bool week1Month1 { get; set; }
    }


    public class FpsFields
    {
        public bool offPayrollWorker { get; set; }
        public bool irregularPaymentPattern { get; set; }
        public bool nonIndividual { get; set; }
        public string hoursNormallyWorked { get; set; }
    }


    public class RegularPayLine
    {
        public double value { get; set; }
        public double rate { get; set; }
        public double multiplier { get; set; }
        public string description { get; set; }
        public string code { get; set; }
        public string pensionId { get; set; }
    }


    
    public class Totals
    {
        public double basicPay { get; set; }
        public double gross { get; set; }
        public double grossForNi { get; set; }
        public double grossForTax { get; set; }
        public double employerNi { get; set; }
        public double employeeNi { get; set; }
        public double tax { get; set; }
        public double netPay { get; set; }
        public double additions { get; set; }
        public double deductions { get; set; }
        public double takeHomePay { get; set; }
        public double pensionableEarnings { get; set; }
        public double pensionablePay { get; set; }
        public double employeePensionContribution { get; set; }
        public double employerPensionContribution { get; set; }
        public double empeePenContribnsPaid { get; set; }
        public double totalCost { get; set; }
        public double tax_value { get; set; }
        public double nationalInsurance_value { get; set; }
        public double? adjustments { get; set; }
        public int? studentLoanRecovered { get; set; }
        public double? dednsFromNetPay { get; set; }
    }

    public class TotalsYtd
    {
        public double gross { get; set; }
        public double employerNi { get; set; }
        public double employeeNi { get; set; }
        public double tax { get; set; }
        public double netPay { get; set; }
        public double takeHomePay { get; set; }
        public double totalCost { get; set; }        
        public double? adjustments { get; set; }

    public double tax_value { get; set; }
        public double nationalInsurance_value { get; set; }


    }


    public class Breakdown
    {
        //Type1 - tax/NI
        //Type2 - total/totalytd

        public double tax { get; set; }

        [JsonProperty("cis Deduction")]
        public int CisDeduction { get; set; }

        [JsonProperty("employee NI")]
        public double EmployeeNI { get; set; }

        [JsonProperty("employer NI")]
        public double EmployerNI { get; set; }

        [JsonProperty("class 1A NICs")]
        public int Class1ANICs { get; set; }
    }


    public class Line
    {
        public string type { get; set; }
        public string code { get; set; }
        public string description { get; set; }
        public string secondaryDescription { get; set; }
        public double value { get; set; }
        public double multiplier { get; set; }
        public string currencySymbol { get; set; }
        public string formattedValue { get; set; }
        public bool hasSecondaryDescription { get; set; }
        public string pensionId { get; set; }
    }







}
