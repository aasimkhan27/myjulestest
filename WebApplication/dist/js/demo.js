function ShowDiv(Type)
{
  document.getElementById('Floatcash').style.display='none';
  document.getElementById('CashM').style.display='none';
  document.getElementById('CardsManual').style.display='none';
  document.getElementById('PettyCash').style.display='none';
  document.getElementById('AccountCustomer').style.display='none';
  document.getElementById('DepositRedeemed').style.display='none';
  document.getElementById('DepositReceived').style.display='none';
switch(Type)
{
case 1:
  document.getElementById('Floatcash').style.display='block';
  break;
  case 2:
    document.getElementById('CashM').style.display='block';
  break;
  case 3:
    document.getElementById('CardsManual').style.display='block';
  break;
  case 4:
    document.getElementById('PettyCash').style.display='block';
  break;
  case 5:
    document.getElementById('AccountCustomer').style.display='block';
  break;
  case 6:
    document.getElementById('DepositRedeemed').style.display='block';
  break;
  case 7:
    document.getElementById('DepositReceived').style.display='block';
  break;
  default:
    break;

}

}