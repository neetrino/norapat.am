> **Աղբյուր.** `vPOS_Arm_3.1.docx` — Markdown արտահանում (mammoth)։ 2026-04-01։

> _Նախազգուշացումներ._ Unrecognised paragraph style: 'Normal (Web)' (Style ID: NormalWeb); Unrecognised paragraph style: 'HTML Preformatted' (Style ID: HTMLPreformatted)

__“Ameriabank vPOS 3\.1”__

__API նկարագրություն__

# Ներածություն

# Փոխգործունեության արձանագրության աշխատանքի հիմնական դրույթները 

# Հարցման և պատասխանի ընդհանուր կառուցվածքը\.

	[1\.   Վճարման կոդի ստացման գործառույթ\`  InitPayment](#GetPaymentID)

	[2\.   Վճարման մասին տեղեկատվության ստացման գործառույթ\` GetPaymentDetails](#GetPaymentFields)

[3\.   Վճարման հաստատման գործառույթ\` ConfirmPayment](#Confirmation)

[4\.   Վճարման չեղարկման գործառույթ\` CancelPayment](#ReversePayment)

[5\.   Վճարման գումարի մասնակի վերադարձման գործառույթ\` RefundPayment](#Refund)

[6\.   Բոլոր վճարումների մասին տեղեկատվության ստացման գործառույթ\` GetTransactionList](#GetTransactionList)

[7\.   Խնդրահարույց գործարքների մասին տեղեկատվության ստացման գործառույթ\` GetProblemTransactions](#GetProblemTransactions)

[Կապակցված գործարքների իրականացում ](#_Транзакции_по_связкам)

[8\.   Կապակցված գործարքի իրականացման գործառույթ\` MakeBindingPayment](#DoBindingTransaction)

[9\.   Կապակցվածության մասին տեղեկատվության ստացման գործառույթ\` GetBindings](#GetBindings)

10\. Կապակցվածության ապաակտիվացման գործառույթ\` DeactivateBinding

11\. Կապակցվածության ակտիվացման գործառույթ\` ActivateBinding

[Աղյուսակ 1\. Գործառնությունների կոդերը և նկարագրությունը ](#Table1) 

[Աղյուսակ 2\. Վճարման կարգավիճակների նշանակությունների ցանկ ](#Table2)

	

# <a id="_Введение"></a>

# Ներածություն

Սույն փաստաթուղթը տեխնիկական նկարագիր է, որտեղ ներկայացված է «AmeriaBank vPOS 3\.1» վճարային համակարգի միացման և հետագա օգտագործման համար անհրաժեշտ տեղեկատվությունը: 

Համակարգին միանալու համար անհրաժեշտ է դիմել Ամերիաբանկ: 

# <a id="_Общие_положения_работы"></a><a id="SOAP"></a>Աշխատանքի ընդհանուր դրույթները 

API փոխգործունեությունը կատարվում է Rest \(ադմինիստրավորման էջը\` SOAP\) արձանագրության միջոցով տվյալների փոխանակման ճանապարհով՝ հետևյալ հասցեներով\.

__URL__

__Նկարագրություն__

[https://servicestest\.ameriabank\.am/VPOS/](https://servicestest.ameriabank.am/VPOS/) 

Հիմնական վճարային համակարգի հասցե 

[https://testpayments\.ameriabank\.am/Admin/webservice/TransactionsInformationService\.svc?wsdl](https://testpayments.ameriabank.am/Admin/webservice/TransactionsInformationService.svc?wsdl)

Գործարքների մասին տեղեկատվության ստացման հասցե 

__Աշխատանքի սխեմա __

1. Հաճախորդը Առևտրային կետի համակարգում  ձևակերպում է պատվեր: 
2. Հաճախորդի կողմից պատվերի հաստատումից հետո, Առևտրային կետի համակարգը գրանցում է պատվերը վճարային համակարգում: 
3. Ի պատասխան գրանցման հարցման՝ վճարային համակարգը տրամադրում է պատվերի նույնականացուցիչը:  
4. Առևտրային կետի համակարգը վերահասցեավորում է հաճախորդին վճարման տվյալների մուտքագրման էջ:
5. Հաճախորդը լրացնում և ուղարկում է տվյալները պրոցեսինգային կենտրոնի սերվերին:
6. Պրոցեսինգային կենտրոնի համակարգը ստուգում է քարտի առկայությունը 3DSecure \(SecureCode\)\-ում և վերահասցեավորում է հաճախորդին ACS \(Access Control Server\) էջ:
7. ACS համակարգում տվյալները լրացնելուց և վճարումն իրականացնելուց հետո հաճախորդը վերահասցեավորվում է այն հասցեի վրա , որն արդեն նշվել էր Առևտրային կետի կողմից պատվերը գրանցելիս: 
8. Հաճախորդը վերահասցեավորվում է Առևտրային կետի էջ:
9. Առևտրային կետի համակարգն ըստ պատվերի համարի կատարում է հարցում պատվերի կարգավիճակի մասին:
10. Վճարային համակարգը ուղարկում է պատվերի կարգավիճակը և վճարման մնացած տվյալները:
11. Առևտրային կետի համակարգը հաճախորդին  ցույց է տալիս կատարված գործարքի  տվյալները իր էջում կամ վերահասցեավորում է վճարային համակարգի էջին : 

### <a id="SOAPStructure"></a>Հարցման և պատասխանի ընդհանուր կառուցվածքը

# <a id="GetPaymentID"></a>1\.   Վճարման կոդի գեներացման գործառույթ    https://servicestest\.ameriabank\.am/VPOS/api/VPOS/InitPayment

__Հարցման պարամետրեր __[ InitPaymentRequest](http://localhost:52470/Help/ResourceModel?modelName=MakePaymentRequest)

__Պարամետր__

__Նկարագիր__

__Տվյալների տիպ__

__Անհրաժեշտություն__

ClientID

Առևտրային կետի նույնականացուցիչ 

string

Այո

Username

Առևտրային կետի մուտքի անուն 

string

Այո

Password

Առևտրային կետի գաղտնաբառ

string

Այո

Currency 

Գործարքի արժույթ \(ISO կոդ\) 

051 \- AMD \(լռելայն\) 

978 \- EUR

840 \- USD

643 \- RUB

string

Ոչ

Description

Գործարքի նկարագիր

string

Այո

OrderID

Գործարքի համար

integer

Այո

Amount

Վճարման գումար 

decimal

Այո

BackURL

Առևտրային կետի հասցե՝ վճարումից հետո հետ վերադառնալու համար

string

Ոչ

Opaque

Հավելյալ տվյալներ

string

Ոչ

CardHolderID

Նույնականացուցիչ կապակցված գործարքներ իրականացնելու համար \(անհրաժեշտ է միայն քարտի ամրակցման ժամանակ\)

string

Ոչ

Timeout

Սեսսիայի տևողություն՝ վայրկյաններով։ Առավելագույն արժեքը կարող է լինել 1200 վայրկյան։ Եթե պարամետրը նշված չէ, սահմանվում է լռելյայն արժեքը \(1200 վայրկյան – 20 րոպե\)

integer

Ոչ

__Հարցման օրինակ __

application/json

\{

  "ClientID": "sample string 1",

  "Amount": 2\.0,

  "OrderID": 3,

  "BackURL": "sample string 4",

  "Username": "sample string 5",

  "Password": "sample string 6",

  "Description": "sample string 7",

  "Currency": "sample string 8",

  "CardHolderID": "sample string 9",

  "Opaque": "sample string 10",

  "Timeout": 110

\}

application/xml

<InitPaymentRequest>

  <ClientID>sample string 1</ClientID>

  <Amount>2</Amount>

  <OrderID>3</OrderID>

  <BackURL>sample string 4</BackURL>

  <Username>sample string 5</Username>

  <Password>sample string 6</Password>

  <Description>sample string 7</Description>

  <Currency>sample string 8</Currency>

  <CardHolderID>sample string 9</CardHolderID>

  <Opaque>sample string 10</Opaque>

  <Timeout>110</Timeout>

</InitPaymentRequest>

__Հարցման պատասխան  __[InitPaymentResponse](http://localhost:52470/Help/ResourceModel?modelName=MakePaymentResponse)

__Պարամետր__

__Նկարագիր__

__Տվյալների տիպ__

__Անհրաժեշտություն__

PaymentID

Վճարման կոդ 

string

ResponseCode

Գործառնության պատասխանի կոդ \(կատարվել է հաջողությամբ =1\)

integer

ResponseMessage

Գործառնության պատասխանի նկարագիր

string

__Պատասխանի օրինակ__

application/json

\{

  "PaymentID": "sample string 1",

  "ResponseCode": 2,

  "ResponseMessage": "sample string 3"

\}

application/xml

<InitPaymentResponse>

  <PaymentID>sample string 1</PaymentID>

  <ResponseCode>2</ResponseCode>

  <ResponseMessage>sample string 3</ResponseMessage>

</InitPaymentResponse>

Այնուհետև առևտրային կետի կայքը պետք է վերահասցեավորի հաճախորդին հետևյալ հասցեին\`

https://servicestest\.ameriabank\.am/VPOS/Payments/Pay?id=@id&lang=@lang 

__URL պարամետրեր__

__Պարամետր__

__Նկարագիր__

__Տվյալների տիպ__

__Անհրաժեշտություն__

id

Վճարման կոդ

string

Այո

lang

Ինտերֆեյսի լեզուն 

am\-հայերեն

ru\-ռուսերեն

en\-անգլերեն 

string

Ոչ

Վճարումն իրականացնելուց հետո համակարգը վերադարձնում է Առևտրային կետի սերվերին __BackURL հասցեով՝ ուղարկելով հետևյալ պարամետրերը\. __

__Պարամետր__

__Նկարագիր__

__Տվյալների տիպ__

__Անհրաժեշտություն__

orderID

Գործարքի համար

string

Այո

responseCode

Գործառնության պատասխանի կոդ \(կատարվել է հաջողությամբ =00\)

string

Այո

paymentID

Վճարման կոդ

string

Այո

opaque

Լրացուցիչ տվյալներ

string

Այո

Գործարքը վերջնականապես ավարտելու համար անհրաժեշտ է կատարել __GetPaymentDetails __հարցումը:

__2\.   Վճարման մասին տեղեկատվության ստացման գործառույթ __<a id="GetPaymentFields"></a>

https://servicestest\.ameriabank\.am/VPOS/api/VPOS/GetPaymentDetails

__Հարցման պարամետրեր __PaymentDetailsRequest

__Պարամետր__

__Նկարագիր__

__Տվյալների տիպ__

__Անհրաժեշտություն__

PaymentID

Վճարման կոդ

string

Այո

Username

Առևտրային կետի մուտքի անուն 

string

Այո

Password

Առևտրային կետի գաղտնաբառ

string

Այո

__Հարցման օրինակ__

application/json

\{

  "PaymentID": "sample string 1",

  "Username": "sample string 2",

  "Password": "sample string 3"

\}

application/xml

<PaymentDetailsRequest>

  <PaymentID>sample string 1</PaymentID>

  <Username>sample string 2</Username>

  <Password>sample string 3</Password>

</PaymentDetailsRequest>

__Հարցման պատասխան __ PaymentDetailsResponse

__Պարամետր__

__Նկարագիր__

__Տվյալների տիպ__

__Անհրաժեշտություն__

Amount

Գործարքի գումար

decimal

ApprovedAmount

Հաճախորդի քարտին արգելափակված գումար 

decimal

ApprovalCode

Գործարքի հավաստագրման կոդ

string

CardNumber

Քարտի քողարկված համար 

string

ClientName

Քարտապանի անուն

string

ClientEmail

Քարտապանի էլ\. հասցե

string

Currency

Գործարքի արժույթ

string

DateTime

Գործարքի ամսաթիվ

string

DepositedAmount

Առևտրային կետի հաշվին մուտքագրված գումար 

decimal

Description

Գործարքի մասին տեղեկատվություն 

string

MerchantId

Առևտրային կետի համար 

string

Opaque

Լրացուցիչ տվյալներ

string

OrderID

Գործարքի եզակի համար

integer

PaymentState

Վճարման կարգավիճակ \(Աղյուսակ 2\.\)

string

PaymentType

Վճարման տիպ

5\- MainRest \(arca\)

7\- PayPal

6\- Binding

[PaymentsEnum](http://localhost:52470/Help/ResourceModel?modelName=PaymentsEnum)

ResponseCode

Գործառնության պատասխանի կոդ \(կատարվել է հաջողությամբ =00\) 

\(Աղյուսակ 1\.\)

string

rrn

Գործարքի կոդ

string

TerminalId

Առևտրային կետի ենթահամար 

string

TrxnDescription

Գործարքի նկարագիր

string

OrderStatus

Վճարման կարգավիճակի կոդ \(Աղյուսակ 2\.\)

integer

RefundedAmount

Քարտին վերադարձվող գումարի մեծություն

decimal

CardHolderID

Նույնականացուցիչ կապակցված գործարքներ իրականացնելու համար

string

MDOrderID

Վճարային համակարգի նունականացուցիչ

string

PrimaryRC

Հիմնական կոդ

ExpDate

Քարտի գործողության ժամկետի ավարտի ամսաթիվ 

string

ProcessingIP

IP հասցե

string

BindingID

Կապակցման նունականացուցիչ

string

ActionCode

Գործողության կոդ

string

ExchangeRate

Փոխարժեք

decimal

__Պատասխանի օրինակ__

application/json

\{

  "Amount": 1\.0,

  "ApprovedAmount": 2\.0,

  "ApprovalCode": "sample string 3",

  "CardNumber": "sample string 4",

  "ClientName": "sample string 5",

  "ClientEmail": "sample string 6",

  "Currency": "sample string 7",

  "DateTime": "sample string 8",

  "DepositedAmount": 9\.0,

  "Description": "sample string 10",

  "MDOrderID": "sample string 11",

  "MerchantId": "sample string 12",

  "TerminalId": "sample string 13",

  "OrderID": "sample string 14",

  "PaymentState": "sample string 15",

  "PaymentType": 0,

  "PrimaryRC": "sample string 16",

  "ResponseCode": "sample string 17",

  "ExpDate": "sample string 18",

  "ProcessingIP": "sample string 19",

  "OrderStatus": "sample string 20",

  "CardHolderID": "sample string 21",

  "BindingID": "sample string 22",

  "RefundedAmount": 23\.0,

  "Opaque": "sample string 24",

  "TrxnDescription": "sample string 25",

  "rrn": "sample string 26",

  "ActionCode": "sample string 27",

  "ExchangeRate": 28\.0

\}

application/xml

<PaymentDetailsResponse>

  <Amount>1</Amount>

  <ApprovedAmount>2</ApprovedAmount>

  <ApprovalCode>sample string 3</ApprovalCode>

  <CardNumber>sample string 4</CardNumber>

  <ClientName>sample string 5</ClientName>

  <ClientEmail>sample string 6</ClientEmail>

  <Currency>sample string 7</Currency>

  <DateTime>sample string 8</DateTime>

  <DepositedAmount>9</DepositedAmount>

  <Description>sample string 10</Description>

  <MDOrderID>sample string 11</MDOrderID>

  <MerchantId>sample string 12</MerchantId>

  <TerminalId>sample string 13</TerminalId>

  <OrderID>sample string 14</OrderID>

  <PaymentState>sample string 15</PaymentState>

  <PaymentType>None</PaymentType>

  <PrimaryRC>sample string 16</PrimaryRC>

  <ResponseCode>sample string 17</ResponseCode>

  <ExpDate>sample string 18</ExpDate>

  <ProcessingIP>sample string 19</ProcessingIP>

  <OrderStatus>sample string 20</OrderStatus>

  <CardHolderID>sample string 21</CardHolderID>

  <BindingID>sample string 22</BindingID>

  <RefundedAmount>23</RefundedAmount>

  <Opaque>sample string 24</Opaque>

  <TrxnDescription>sample string 25</TrxnDescription>

  <rrn>sample string 26</rrn>

  <ActionCode>sample string 27</ActionCode>

  <ExchangeRate>28</ExchangeRate>

</PaymentDetailsResponse>

__3\.   Վճարման հաստատման գործառույթ __https://servicestest\.ameriabank\.am/VPOS/api/VPOS/ConfirmPayment

__Հարցման պարամետրեր __ConfirmPaymentRequest

__Պարամետր__

__Նկարագիր__

__Տվյալների տիպ__

__Անհրաժեշտություն__

PaymentID

Վճարման կոդ

string

Այո

Username

Առևտրային կետի մուտքի անուն 

string

Այո

Password

Առևտրային կետի գաղտնաբառ

string

Այո

Amount

Հաստատվող գումար

decimal

Այո

__Հարցման օրինակ__

application/json

\{

  "PaymentID": "sample string 1",

  "Username": "sample string 2",

  "Password": "sample string 3",

  "Amount": 10

\}

application/xm

<ConfirmRequest>

  <PaymentID>sample string 1</PaymentID>

  <Username>sample string 2</Username>

  <Password>sample string 3</Password>

</ConfirmRequest>

__Հարցման պատասխան __ConfirmPaymentResponse

__Պարամետր__

__Նկարագիր__

__Տվյալների տիպ__

__Անհրաժեշտություն__

ResponseCode

Գործառնության պատասխանի կոդ  \(կատարվել է հաջողությամբ=00\) 

\(Աղյուսակ 1\.\)

string

ResponseMessage

Գործառնության պատասխանի նկարագիր

string

Opaque

Հավելյալ տվյալներ

string

__Պատասխանի օրինակ__

application/json

\{

  "ResponseCode": "sample string 1",

  "ResponseMessage": "sample string 2",

  "Opaque": "sample string 3"

\}

application/xml

<ConfirmResponse>

  <ResponseCode>sample string 1</ResponseCode>

  <ResponseMessage>sample string 2</ResponseMessage>

  <Opaque>sample string 3</Opaque>

</ConfirmResponse>

__4\.   Վճարման չեղարկման գործառույթ __<a id="ReversePayment"></a>https://servicestest\.ameriabank\.am/VPOS/api/VPOS/CancelPayment

__Ուշադրությո՛ւն\. նշված գործառույթը գործում է վճարումն իրականացնելուց հետո 72 ժամվա ընթացքում:__

__Հարցման պարամետրեր __CancelPaymentRequest 

__Պարամետր__

__Նկարագիր__

__Տվյալների տիպ__

__Անհրաժեշտություն__

PaymentID

Վճարման կոդ

string

Այո

Username

Առևտրային կետի մուտքի անուն 

string

Այո

Password

Առևտրային կետի գաղտնաբառ

string

Այո

__Հարցման օրինակ__

application/json

\{

  "PaymentID": "sample string 1",

  "Username": "sample string 2",

  "Password": "sample string 3"

\}

application/xml

<CancelPaymentRequest>

  <PaymentID>sample string 1</PaymentID>

  <Username>sample string 2</Username>

  <Password>sample string 3</Password>

</CancelPaymentRequest>

__Հարցման պատասխան __CancelPaymentResponse

__Պարամետր__

__Նկարագիր__

__Տվյալների տիպ__

__Անհրաժեշտություն__

Opaque

Լրացուցիչ տվյալներ

string

ResponseCode

Գործառնության պատասխանի կոդ \(կատարվել է հաջողությամբ=00\) 

\(Աղյուսակ 1\.\)

string

ResponseMessage

Գործառնության պատասխանի նկարագիր

string

__Պատասխանի օրինակ__

application/json

\{

  "ResponseCode": "sample string 1",

  "ResponseMessage": "sample string 2",

  "Opaque": "sample string 3"

\}

application/xml

<CancelPaymentResponse>

  <ResponseCode>sample string 1</ResponseCode>

  <ResponseMessage>sample string 2</ResponseMessage>

  <Opaque>sample string 3</Opaque>

</CancelPaymentResponse>

Վճարումները կարելի է իրականացնել 

- __Մեկ փուլով, __երբ վճարման ենթակա ողջ գումարը միանգամից ելքագրվում է գնորդի հաշվից
- __Երկու փուլով\. __երբ վճարման ենթակա գումարը առաջին փուլում սառեցվում է գնորդի հաշվին, իսկ երկրորդ փուլում՝ ելքագրվում վերջինիս հաշվից: 

Երկու փուլով իրականացվող վճարման դեպքում երկրորդ փուլի իրականացման և գնորդի \(քարտապանի\) հաշվից գումարի ելքագրման համար անհրաժեշտ է կատարել __Confirmation__ հարցումը: Վճարումը չեղարկելու և գումարը գնորդի \(քարտապանի\) հաշվին հետ փոխանցելու նպատակով անհրաժեշտ է կատարել __CancelPayment__ հարցումը: 

__5\.   __<a id="Refund"></a>__Վճարված գումարի մասնակի վերադարձի գործառույթ__ 

https://servicestest\.ameriabank\.am/VPOS/api/VPOS/RefundPayment

__Հարցման պարամետրեր __RefundPaymentRequest

__Պարամետր__

__Նկարագիր__

__Տվյալների տիպ__

__Անհրաժեշտություն__

PaymentID

Վճարման կոդ

string

Այո

Username

Առևտրային կետի մուտքի անուն 

string

Այո

Password

Առևտրային կետի գաղտնաբառ

string

Այո

Amount

Մասնակի վերադարձվող գումարը, որը չի կարող գերազանցել գործարքի գումարը

decimal

Այո

__Հարցման օրինակ__

application/json

\{

  "PaymentID": "sample string 1",

  "Username": "sample string 2",

  "Password": "sample string 3",

  "Amount": 4\.0

\}

application/xm

<RefundRequest>

  <PaymentID>sample string 1</PaymentID>

  <Username>sample string 2</Username>

  <Password>sample string 3</Password>

  <Amount>4</Amount>

</RefundRequest>

__Հարցման պատասխան __RefundPaymentResponse

__Պարամետր__

__Նկարագիր__

__Տվյալների տիպ__

__Անհրաժեշտություն__

Opaque

Լրացուցիչ տվյալներ

string

ResponseCode

Գործառնության պատասխանի կոդ  \(կատարվել է հաջողությամբ=00\) 

\(Աղյուսակ 1\.\)

string

ResponseMessage

Գործառնության պատասխանի նկարագիր

string

__Պատասխանի օրինակ__

application/json

\{

  "ResponseCode": "sample string 1",

  "ResponseMessage": "sample string 2",

  "Opaque": "sample string 3"

\}

application/xml

<RefundResponse>

  <ResponseCode>sample string 1</ResponseCode>

  <ResponseMessage>sample string 2</ResponseMessage>

  <Opaque>sample string 3</Opaque>

</RefundResponse>

__6\.   Բոլոր վճարումների մասին տեղեկատվության ստացման գործառույթ __<a id="GetTransactionList"></a>GetTransactionList

__Հարցման պարամետրեր __TransactionClient

__Պարամետր__

__Նկարագիր__

__Տվյալների տիպ__

__Անհրաժեշտություն__

ClientID

Առևտրային կետի նույնականացուցիչ

string

Այո

Username

Առևտրային կետի մուտքի անուն

string

Այո

Password

Առևտրային կետի գաղտնաբառ

string

Այո

StartDate

Գործարքների ցանկ՝ սկսած նշված ամսաթվից \(ձևաչափ՝ տարի/ամիս/օր ժամ/րոպե\)

string

Այո

EndDate

Գործարքների ցանկ՝ մինչև նշված ամսաթիվը \(ձևաչափ՝ տարի/ամիս/օր ժամ/րոպե\)

string

Այո

__Հարցման օրինակ__

<s:Envelope xmlns:s="http://schemas\.xmlsoap\.org/soap/envelope/">

  <s:Header>

    <Action s:mustUnderstand="1" xmlns="http://schemas\.microsoft\.com/ws/2005/05/addressing/none">http://payments\.ameriabank\.am/ITransactionsInformationService/ITransactionsInformationService/GetTransactionList</Action>

  </s:Header>

  <s:Body>

    <GetTransactionList xmlns="http://payments\.ameriabank\.am/ITransactionsInformationService">

      <transclient xmlns:d4p1="payments\.ameriabank\.am/TransactionClient" xmlns:i="http://www\.w3\.org/2001/XMLSchema\-instance">

        <d4p1:ClientID>83D64FD0\-594E\-456F\-BAF9\-3E3135E37639</d4p1:ClientID>

        <d4p1:EndDate>2015/05/01 14:30</d4p1:EndDate>

        <d4p1:Password>lazY2k</d4p1:Password>

        <d4p1:StartDate>2015/05/01 14:18</d4p1:StartDate>

        <d4p1:Username>3d19541048</d4p1:Username>

      </transclient>

    </GetTransactionList>

  </s:Body>

</s:Envelope>

__Հարցման պատասխան __TransactionFields

__Պարամետր__

__Նկարագիր__

__Տվյալների տիպ__

__Անհրաժեշտություն__

Amount

Գործարքի գումար

decimal

ApproveAmount

Քարտապանի հաշվին արգելափակված գումար 

decimal

AuthCode

Գործարքի հավաստագրման կոդ  

string

CardNumber

Քարտի քողարկված համար

string

ClientName

Քարտապանի անուն

string

Currency

Գործարքի արժույթ

string

DepositAmount

Առևտրային կետի հաշվին մուտքագրված գումար

decimal

Descr

Գործարքի մասին տեղեկատվություն 

string

ErrorMessage

Սխալի նկարագիր

string

Opaque

Opaque դաշտի արժեք

string

OperDate

Գործարքի իրականացման ամսաթիվ

string

OrderID

Գործարքի համար

string

PaymentID

Վճարման համար

string

PaymentState

Վճարման կարգավիճակ

string

PaymentType  

Վճարման տիպ

1\- Virtual Arca

3\- Visa, MasterCard, Arca \(epay\)

5 \- Visa, MasterCard, Arca \(ipay\)

6\- Binding

integer

RRN

RRN դաշտի արժեք

string

RespCode

Գործառնության պատասխանի կոդ \(կատարվել է հաջողությամբ=00\) 

\(Աղյուսակ 1\.\)

string

Stan

Stan դաշտի արժեք

string

TrxnDetails

Գործարքի նկարագիր

string

__Պատասխանի օրինակ__

<s:Envelope xmlns:s="http://schemas\.xmlsoap\.org/soap/envelope/">

  <s:Header />

  <s:Body>

    <GetTransactionListResponse xmlns="http://payments\.ameriabank\.am/ITransactionsInformationService">

      <GetTransactionListResult xmlns:a="payments\.ameriabank\.am/TransactionFields" xmlns:i="http://www\.w3\.org/2001/XMLSchema\-instance">

        <a:PaymentFields>

          <a:Amount>5\.00</a:Amount>

          <a:ApproveAmount>5\.00</a:ApproveAmount>

          <a:AuthCode>422841</a:AuthCode>

          <a:CardNumber>408306\*\*3143</a:CardNumber>

          <a:ClientName>orange\.com</a:ClientName>

          <a:Currency>051</a:Currency>

          <a:DepositAmount>0\.00</a:DepositAmount>

          <a:Descr i:nil="true" />

          <a:ErrorMessage i:nil="true" />

          <a:Opaque>Test</a:Opaque>

          <a:OperDate>Wed Mar 18 00:53:25 AMT 2</a:OperDate>

          <a:OrderID>58554654</a:OrderID>

          <a:PaymentID>b3201a82\-dc65\-430c\-9c46\-d1bf294c5770</a:PaymentID>

          <a:PaymentState>4</a:PaymentState>

          <a:PaymentType>3</a:PaymentType>

          <a:RRN>\-118\-94\-50\-53117\-22\-374393121252118\-118106\-36\_p1</a:RRN>

          <a:RespCode>00 : Payment Successfully Completed</a:RespCode>

          <a:Stan />

          <a:TrxnDetails>This is orderid=58554654</a:TrxnDetails>

        </a:PaymentFields>

        </GetTransactionListResult>

    </GetTransactionListResponse>

  </s:Body>

</s:Envelope>

__7\.   Խնդրահարույց գործարքների վերաբերյալ տեղեկատվության ստացման գործառույթ__<a id="GetProblemTransactions"></a>__ __GetProblemTransactions

__Հարցման պարամետրեր __TransactionClient

__Պարամետր__

__Նկարագիր__

__Տվյալների տիպ__

__Անհրաժեշտություն__

ClientID

Առևտրային կետի նույնականացուցիչ

string

Այո

Username

Առևտրային կետի մուտքի անուն

string

Այո

Password

Առևտրային կետի գաղտնաբառ

string

Այո

EndDate

Գործարքների ցանկ՝ սկսած նշված ամսաթվից \(ձևաչափ՝ տարի/ամիս/օր ժամ/րոպե\)

string

Այո

StartDate

Գործարքների ցանկ՝ մինչև նշված ամսաթիվը \(ձևաչափ՝ տարի/ամիս/օր ժամ/րոպե\)

string

Այո

__Հարցման օրինակ__

<s:Envelope xmlns:s="http://schemas\.xmlsoap\.org/soap/envelope/">

  <s:Header>

    <Action s:mustUnderstand="1" xmlns="http://schemas\.microsoft\.com/ws/2005/05/addressing/none">http://payments\.ameriabank\.am/ITransactionsInformationService/ITransactionsInformationService/GetProblemTransactions</Action>

  </s:Header>

  <s:Body>

    <GetProblemTransactions xmlns="http://payments\.ameriabank\.am/ITransactionsInformationService">

      <transclient xmlns:d4p1="payments\.ameriabank\.am/TransactionClient" xmlns:i="http://www\.w3\.org/2001/XMLSchema\-instance">

        <d4p1:ClientID>83D64FD0\-594E\-456F\-BAF9\-3E3135E37639</d4p1:ClientID>

        <d4p1:EndDate>2015/05/01 14:30</d4p1:EndDate>

        <d4p1:Password>lazY2k</d4p1:Password>

        <d4p1:StartDate>2015/05/01 14:18</d4p1:StartDate>

        <d4p1:Username>3d19541048</d4p1:Username>

      </transclient>

    </GetProblemTransactions>

  </s:Body>

</s:Envelope>

__Հարցման պատասխան __ProblemTransactions

__Պարամետր__

__Նկարագիր__

__Տվյալների տիպ__

__Անհրաժեշտություն__

CardNumber

Քարտի համար

string

ErrorMessage

Սխալի նկարագիր

string

OrderID

Գործարքի համար 

integer

PaymentDate

Գործարքի ամսաթիվ

string

PaymentSum

Գործարքի գումար

decimal

__Պատասխանի օրինակ__

<s:Envelope xmlns:s="http://schemas\.xmlsoap\.org/soap/envelope/">

  <s:Header />

  <s:Body>

    <GetProblemTransactionsResponse xmlns="http://payments\.ameriabank\.am/ITransactionsInformationService">

      <GetProblemTransactionsResult xmlns:a="payments\.ameriabank\.am/ProblemTransactions" xmlns:i="http://www\.w3\.org/2001/XMLSchema\-instance">

        <a:ProblemTransactions>

          <a:CardNumber>408306\*\*3143</a:CardNumber>

          <a:ErrorMessage>Transaction is completed in processing but does not exists in database</a:ErrorMessage>

          <a:OrderID>1189</a:OrderID>

          <a:PaymentDate>01\-05\-2015</a:PaymentDate>

          <a:PaymentSum>10\.00</a:PaymentSum>

        </a:ProblemTransactions>

      </GetProblemTransactionsResult>

    </GetProblemTransactionsResponse>

  </s:Body>

</s:Envelope>

### <a id="_Транзакции_по_связкам"></a>Կապակցված գործարքներ 

Կապակցված գործարքները առևտրային կետին հնարավորություն են տալիս իրականացնել հերթական վճարումներ՝ առանց օգտագործողի կողմից վճարային քարտի տվյալները կրկին մուտքագրելու անհրաժեշտության: Օգտագործողը, ով արդեն մեկ անգամ մուտքագրել է քարտային տվյալները և հաջողությամբ վճարում իրականացրել, կարող է կատարել հետագա վճարումները՝ առանց քարտի տվյալները մուտքագրելու:

Գնորդի քարտը կապակցելու համար առևտրային կետը պետք է ուղարկի նույնականացման համար \(CardHolderID\) ըստ վերևում նկարագրված սխեմայի:

__8\.   Կապակցված վճարման իրականացման գործառույթ __<a id="DoBindingTransaction"></a>

https://servicestest\.ameriabank\.am/VPOS/api/VPOS/MakeBindingPayment

__Հարցման պարամետրեր __MakeBindingPaymentRequest

__Պարամետր__

__Նկարագիր__

__Տվյալների տիպ__

__Անհրաժեշտություն__

ClientID

Առևտրային կետի նույնականացուցիչ

string

Այո

Username

Առևտրային կետի մուտքի անուն

string

Այո

Password

Առևտրային կետի գաղտնաբառ

string

Այո

Currency 

Գործարքի արժույթ \(ISO կոդ\) 

051 \- AMD \(լռելայն\) 

978 \- EUR

840 \- USD

643 \- RUB

string

Ոչ

Description

Գործարքի նկարագիր

string

Այո

OrderID

Գործարքի կոդ

integer

Այո

Amount

Վճարման գումար

decimal

Այո

Opaque

Լրացուցիչ տվյալներ

string

Ոչ

CardHolderID

Նույնականացուցիչ կապակցված գործարքներ իրականացնելու համար

string

Այո

BackURL

Առևտրային կետի հասցե՝ վճարումից հետո հետ վերադառնալու համար

string

Այո

PaymentType

Վճարման տիպ

5\- MainRest \(arca\)

7\- PayPal

6\- Binding

[PaymentsEnum](http://localhost:52470/Help/ResourceModel?modelName=PaymentsEnum)

Այո

__Հարցման օրինակ __

application/json

\{

  "ClientID": "sample string 1",

  "Username": "sample string 2",

  "Password": "sample string 3",

  "CardHolderID": "sample string 4",

  "Amount": 5\.0,

  "OrderID": 6,

  "BackURL": "sample string 7",

  "PaymentType": 0,

  "Description": "sample string 8",

  "Currency": "sample string 9",

  "Opaque": "sample string 10"

\}

application/xml

<MakeBindingPaymentRequest>

  <ClientID>sample string 1</ClientID>

  <Username>sample string 2</Username>

  <Password>sample string 3</Password>

  <CardHolderID>sample string 4</CardHolderID>

  <Amount>5</Amount>

  <OrderID>6</OrderID>

  <BackURL>sample string 7</BackURL>

  <PaymentType>None</PaymentType>

  <Description>sample string 8</Description>

  <Currency>sample string 9</Currency>

  <Opaque>sample string 10</Opaque>

</MakeBindingPaymentRequest>

__Հարցման պատասխան __MakeBindingPaymentResponse

__Պարամետր__

__Նկարագիր__

__Տվյալների տիպ__

__Անհրաժեշտություն__

PaymentID

Վճարման կոդ

string

Amount

Գործարքի գումար 

decimal

ApprovedAmount

Հաճախորդի քարտին արգելափակված գումար 

decimal

ApprovalCode

Գործարքի հավաստագրման կոդ

string

CardNumber

Քարտի քողարկված համար 

string

ClientName

Քարտապանի անուն

string

Currency

Գործարքի արժույթ

string

DateTime

Գործարքի ամսաթիվ

string

DepositedAmount

Առևտրային կետի հաշվին մուտքագրված գումար

decimal

Description

Գործարքի մասին տեղեկատվություն 

string

MDOrderID

Վճարային համակարգի նունականացուցիչ

string

ExpDate

Քարտի գործողության ժամկետի ավարտի ամսաթիվ

string

MerchantId

Առևտրային կետի merchantid 

string

Opaque

Լրացուցիչ տվյալներ

string

OrderID

Գործարքի եզակի համար

integer

PaymentState

Վճարման կարգավիճակ 

\(Աղյուսակ 2\.\)

string

PaymentType

Վճարման տիպ

5\- MainRest \(arca\)

7\- PayPal

6\- Binding

[PaymentsEnum](http://localhost:52470/Help/ResourceModel?modelName=PaymentsEnum)

PrimaryRC

Հիմնական կոդ

string

ResponseCode

Գործառնության պատասխանի կոդ \(հաջողությամբ կատարվել է =00\) 

\(Աղյուսակ 1\.\)

string

ProcessingIP

IP հասցե

string

rrn

Գործարքի եզակի կոդ

string

TerminalId

Առևտրային կետի terminalid 

string

TrxnDescription

Գործարքի նկարագիր

string

OrderStatus

Վճարման կարգավիճակի կոդ

\(Աղյուսակ 2\.\)

integer

RefundedAmount

Քարտին վերադարձվող գումարի մեծություն

decimal

CardHolderID

Նույնականացուցիչ կապակցված գործարքներ իրականացնելու համար

string

BindingID

Կապակցման նունականացուցիչ

string

ActionCode

Գործողության կոդ

string

__Պատասխանի օրինակ__

application/json

\{

  "PaymentID": "sample string 0",

  "ResponseCode": "sample string 1",

  "Amount": 2\.0,

  "ApprovedAmount": 3\.0,

  "ApprovalCode": "sample string 4",

  "CardNumber": "sample string 5",

  "ClientName": "sample string 6",

  "Currency": "sample string 7",

  "DateTime": "sample string 8",

  "DepositedAmount": 9\.0,

  "Description": "sample string 10",

  "MDOrderID": "sample string 11",

  "MerchantId": "sample string 12",

  "TerminalId": "sample string 13",

  "OrderID": "sample string 14",

  "PaymentState": "sample string 15",

  "PaymentType": 0,

  "PrimaryRC": "sample string 16",

  "ExpDate": "sample string 17",

  "ProcessingIP": "sample string 18",

  "OrderStatus": "sample string 19",

  "CardHolderID": "sample string 20",

  "BindingID": "sample string 21",

  "RefundedAmount": 22\.0,

  "Opaque": "sample string 23",

  "TrxnDescription": "sample string 24",

  "rrn": "sample string 25",

  "ActionCode": "sample string 26"

\}

application/xml

<MakeBindingPaymentResponse>

  <PaymentID>sample string 0</PaymentID>

  <ResponseCode>sample string 1</ResponseCode>

  <Amount>2</Amount>

  <ApprovedAmount>3</ApprovedAmount>

  <ApprovalCode>sample string 4</ApprovalCode>

  <CardNumber>sample string 5</CardNumber>

  <ClientName>sample string 6</ClientName>

  <Currency>sample string 7</Currency>

  <DateTime>sample string 8</DateTime>

  <DepositedAmount>9</DepositedAmount>

  <Description>sample string 10</Description>

  <MDOrderID>sample string 11</MDOrderID>

  <MerchantId>sample string 12</MerchantId>

  <TerminalId>sample string 13</TerminalId>

  <OrderID>sample string 14</OrderID>

  <PaymentState>sample string 15</PaymentState>

  <PaymentType>None</PaymentType>

  <PrimaryRC>sample string 16</PrimaryRC>

  <ExpDate>sample string 17</ExpDate>

  <ProcessingIP>sample string 18</ProcessingIP>

  <OrderStatus>sample string 19</OrderStatus>

  <CardHolderID>sample string 20</CardHolderID>

  <BindingID>sample string 21</BindingID>

  <RefundedAmount>22</RefundedAmount>

  <Opaque>sample string 23</Opaque>

  <TrxnDescription>sample string 24</TrxnDescription>

  <rrn>sample string 25</rrn>

  <ActionCode>sample string 26</ActionCode>

</MakeBindingPaymentResponse>

__9\.   Կապակցված գործարքների մասին տեղեկատվության ստացման գործառույթ__<a id="GetBindings"></a>__ __

https://servicestest\.ameriabank\.am/VPOS/api/VPOS/GetBindings

__Հարցման պարամետրեր __GetBindingsRequest 

__Պարամետր__

__Նկարագիր__

__Տվյալների տիպ__

__Անհրաժեշտություն__

ClientID

Առևտրային կետի նույնականացուցիչ

string

Այո

Password

Առևտրային կետի գաղտնաբառ

string

Այո

Username

Առևտրային կետի մուտքի անուն

string

Այո

PaymentType

Վճարման տիպ

5\- MainRest \(arca\)

7\- PayPal

6\- Binding

[PaymentsEnum](http://localhost:52470/Help/ResourceModel?modelName=PaymentsEnum)

Այո

__Հարցման օրինակ__

application/json

\{

  "ClientID": "sample string 1",

  "Username": "sample string 2",

  "Password": "sample string 3",

  "PaymentType": 0

\}

application/xml

<GetBindingsRequest>

  <ClientID>sample string 1</ClientID>

  <Username>sample string 2</Username>

  <Password>sample string 3</Password>

  <PaymentType>None</PaymentType>

</GetBindingsRequest>

__Հարցման պատասխան __GetBindingsResponse

__Պարամետր__

__Նկարագիր__

__Տվյալների տիպ__

__Անհրաժեշտություն__

ResponseCode

Գործառնության պատասխանի կոդ

string

ResponseMessage

Գործառնության պատասխանի նկարագիր

string

CardBindingFileds 

CardBindingFiled ցուցակ

List<CardBindingFiled>

CardBindingFiled

__Պարամետր__

__Նկարագիր__

__Տվյալների տիպ__

__Անհրաժեշտություն__

CardPan

Քարտի քողարկված համար  

string

ExpDate

Քարտի գործողության ժամկետի ավարտի ամսաթիվ 

string

IsAvtive

Գործող կամ չգործող կապ \(հանգույց\)

Boolean

CardHolderID

Նույնականացուցիչ կապակցված գործարքներ իրականացնելու համար

string

__Պատասխանի օրինակ__

application/json

\{

  "ResponseCode": "sample string 1",

  "ResponseMessage": "sample string 2",

  "CardBindingFileds": \[

    \{

      "CardHolderID": "sample string 1",

      "CardPan": "sample string 2",

      "ExpDate": "sample string 3",

      "IsAvtive": true

    \},

    \{

      "CardHolderID": "sample string 1",

      "CardPan": "sample string 2",

      "ExpDate": "sample string 3",

      "IsAvtive": true

    \}

  \]

\}

application/xml

<GetBindingsResponse>

  <ResponseCode>sample string 1</ResponseCode>

  <ResponseMessage>sample string 2</ResponseMessage>

  <CardBindingFileds>

    <CardBindingFiled>

      <CardHolderID>sample string 1</CardHolderID>

      <CardPan>sample string 2</CardPan>

      <ExpDate>sample string 3</ExpDate>

      <IsAvtive>true</IsAvtive>

    </CardBindingFiled>

    <CardBindingFiled>

      <CardHolderID>sample string 1</CardHolderID>

      <CardPan>sample string 2</CardPan>

      <ExpDate>sample string 3</ExpDate>

      <IsAvtive>true</IsAvtive>

    </CardBindingFiled>

  </CardBindingFileds>

</GetBindingsResponse>

__10\.   Կապակցվածության ապաակտիվացման գործառույթ __<a id="DeactivateBindings"></a>

https://servicestest\.ameriabank\.am/VPOS/api/VPOS/DeactivateBinding

__Հարցման պարամետրեր __DeactivateBindingRequest

__Պարամետր__

__Նկարագիր__

__Տվյալների տիպ__

__Անհրաժեշտություն__

ClientID

Առևտրային կետի նույնականացուցիչ

string

Այո

Password

Առևտրային կետի գաղտնաբառ

string

Այո

Username

Առևտրային կետի մուտքի անուն

string

Այո

PaymentType

Վճարման տիպ

5\- MainRest \(arca\)

7\- PayPal

6\- Binding

[PaymentsEnum](http://localhost:52470/Help/ResourceModel?modelName=PaymentsEnum)

Այո

CardHolderID

Նույնականացուցիչ կապակցված գործարքներ իրականացնելու համար

string

Այո

__Հարցման օրինակ__

application/json

\{

  "ClientID": "sample string 1",

  "Username": "sample string 2",

  "Password": "sample string 3",

  "CardHolderID": "sample string 4",

  "PaymentType": 0

\}

application/xml

<DeactivateBindingRequest>

  <ClientID>sample string 1</ClientID>

  <Username>sample string 2</Username>

  <Password>sample string 3</Password>

  <CardHolderID>sample string 4</CardHolderID>

  <PaymentType>None</PaymentType>

</DeactivateBindingRequest>

__Հարցման պատասխան __DeactivateBindingResponse

__Պարամետր__

__Նկարագիր__

__Տվյալների տիպ__

__Անհրաժեշտություն__

ResponseCode

Գործառնության պատասխանի կոդ \(հաջողությամբ կատարվել է =00\) 

\(Աղյուսակ 1\.\)

string

ResponseMessage

Գործառնության պատասխանի նկարագիր

string

CardHolderID

Նույնականացուցիչ կապակցված գործարքներ իրականացնելու համար

string

__Պատասխանի օրինակ__

application/json

\{

  "ResponseCode": "sample string 1",

  "ResponseMessage": "sample string 2",

  "CardHolderID": "sample string 3"

\}

application/xm

<DeactivateBindingResponse>

  <ResponseCode>sample string 1</ResponseCode>

  <ResponseMessage>sample string 2</ResponseMessage>

  <CardHolderID>sample string 3</CardHolderID>

</DeactivateBindingResponse>

1. __Կապակցվածության ակտիվացման գործառույթ __<a id="ActivateBindings"></a>

https://servicestest\.ameriabank\.am/VPOS/api/VPOS/ActivateBinding

__Հարցման պարամետրեր __ActivateBindingRequest

__Պարամետր__

__Նկարագիր__

__Տվյալների տիպ__

__Անհրաժեշտություն__

ClientID

Առևտրային կետի նույնականացուցիչ

string

Այո

Password

Առևտրային կետի գաղտնաբառ

string

Այո

Username

Առևտրային կետի մուտքի անուն

string

Այո

PaymentType

Վճարման տիպ

5\- MainRest \(arca\)

7\- PayPal

6\- Binding

[PaymentsEnum](http://localhost:52470/Help/ResourceModel?modelName=PaymentsEnum)

Այո

CardHolderID

Նույնականացուցիչ կապակցված գործարքներ իրականացնելու համար

string

__Հարցման օրինակ__

application/json

\{

  "ClientID": "sample string 1",

  "Username": "sample string 2",

  "Password": "sample string 3",

  "CardHolderID": "sample string 4",

  "PaymentType": 0

\}

application/xml

<ActivateBindingRequest>

  <ClientID>sample string 1</ClientID>

  <Username>sample string 2</Username>

  <Password>sample string 3</Password>

  <CardHolderID>sample string 4</CardHolderID>

  <PaymentType>None</PaymentType>

</ActivateBindingRequest>

__Հարցման պատասխան __ActivateBindingResponse

__Պարամետր__

__Նկարագիր__

__Տվյալների տիպ__

__Անհրաժեշտություն__

ResponseCode

Գործառնության պատասխանի կոդ \(հաջողությամբ կատարվել է =00\) 

\(Աղյուսակ 1\.\)

string

ResponseMessage

Գործառնության պատասխանի նկարագիր

string

CardHolderID

Նույնականացուցիչ կապակցված գործարքներ իրականացնելու համար

string

__Պատասխանի օրինակ__

application/json

\{

  "ResponseCode": "sample string 1",

  "ResponseMessage": "sample string 2",

  "CardHolderID": "sample string 3"

\}

application/xml

<ActivateBindingResponse>

  <ResponseCode>sample string 1</ResponseCode>

  <ResponseMessage>sample string 2</ResponseMessage>

  <CardHolderID>sample string 3</CardHolderID>

</ActivateBindingResponse>

<a id="Table1"></a>

__Աղյուսակ 1\. Գործառնությունների կոդերը և նկարագրերը  __

__Պատասխանի կոդ__

__Պատասխան հաղորդագրություն__

__Պատասխան հաղորդագրության նկարագիր \(RU\)__

0\-1

sv\_unavailable

Սպառվել է պրոցեսինգային կետրոնի պատասխանին սպասելու ժամանակը:

0\-100

no\_payments\_yet

Վճարման փորձեր չեն եղել:

0\-2000

Decline\. PAN blacklisted

Գործարքը մերժվել է, քանի որ քարտը գրանցված է սև ցուցակում: 

0\-2001

Decline\. IP blacklisted

Գործարքը մերժվել է, քանի որ հաճախորդի IP հասցեն գրանցված է սև ցուցակում:

0\-20010

BLOCKED\_BY\_LIMIT

Գործարքը մերժվել է, քանի որ վճարումը գերազանցել է թողարկող բանկի կողմից սահմանված սահմանաչափը 

0\-2002

Decline\. Payment over limit

Գործարքը մերժվել է, քանի որ վճարումը գերազանցել է սահմանված սահմանաչափը: 

Ծանոթագրություն\. հաշվի են առնվում կամ էքվայեր բանկի կողմից առևտրային կետի օրական շրջանառության համար սահմանված սահմանաչափերը կամ առևտրային կետի՝ մեկ քարտով շրջանառության սահմանաչափը կամ էլ առևտրային կետի՝ մեկ գործառնության գծով սահմանաչափը:

0\-2004

SSL without CVC forbidden

Արգելվում է SSL –ի միջոցով առանց SVС մուտքագրման վճարում իրականացնել:

0\-2005

Decline\. 3DSec sign error

Մենք չենք կարողացել ստուգել թողարկողի ստորագրությունը, այսինքն PARes\-ն ընթեռնելի էր, բայց սխալ էր ստորագրված:

0\-2006

Decline\. 3DSec decline

Թողարկողը մերժել է նույնականացումը:

0\-2007

Decline\. Payment time limit

Սպառվել է վճարման գրանցման պահից սկսած քարտի տվյալների մուտքագրման համար սահմանված ժամկետը \(նշված պահին թայմաութը տեղի կունենա 20 րոպեից\):

0\-2011

Declined\. PaRes status is unknown

Քարտը դիտարկվել է որպես 3d secure քարտում նեգրավված, բայց թողարկող բանկը \(տվյալ պահին\) պատրաստ չէ իրականացնել գործարքի 3ds:

0\-2012

Operation not supported

Նշված գործարքը չի սպասարկվում համակարգի կողմից:

0\-2013

Исчерпаны  
  
попытки оплаты

Վճարման փորձերը սպառվել են:

0\-2015

Decline by iReq in VERes

DS\-ի VERes\-ը պարունակում է iReq, որի հետևանքով վճարումը մերժվել է:

0\-2016

Declined\. VeRes status is unknown

Նշանակում է որ թողարկող բանկը \(տվյալ պահին\) պատրաստ չէ իրականացնել գործարքի 3ds \(օրինակ՝ չի աշխատում բանկի ACS\-ն\) և մենք չենք կարող ստուգել արդյոք քարտը ներգրավված է 3d secure\-ում, թե ոչ: 

0\-2018

Declined\. DS connection timeout

Directory server Visa կամ MasterCard հասանելի չեն, կամ քարտի ներգավվածության հարցման\(VeReq\) պատասխանը չի ստացվել կապի խափանման պատճառով: Նշված սխալը հանդիսանում է վճարային ուղեմուտի և միջազգային վճարային համակարգի սերվերների փոխգործունեության արդյունքը՝ վերջիններիս տեխնիկական խափանումների պատճառով:

0\-2019

Decline by iReq in PARes

Թողարկողի PARes պարունակում է iReq, ինչի արդյունքում վճարումը մերժվել է:

0\-9000

Started

Գործարքի սկզբի կարգավիճակ:

00

Approved\.

Վճարումը հաջողությամբ իրականացվել է:

01

Order already exists

Նշված համարով պատվերն արդեն գրանցված է համակարգում:

0100

Decline\. Card declined

Թողարկող բանկն արգելել է քարտով առցանց գործարքների իրականացումը:

01001

Decline\. Data input timeout

Տրվում է գործարքի գրանցման պահին, այսինքն այն պահին, երբ քարտի տվյալները դեռևս չեն ներմուծվել:

0101

Decline\. Expired card

Քարտի գործողության ժամկետը սպառվել է:

0103

Decline\. Call issuer

Թողարկող բանկի հետ կապը բացակայում է, առևտրային կետը պետք է կապ հաստատի թողարկող բանկի հետ:

0104

Decline\. Card declined

Սահմանափակումների ենթարկված հաշվով գործարք կատարելու փորձ:

0107

Decline\. Call issuer

Անհրաժեշտ է դիմել թողարկող բանկին:

0109

Decline\. Invalid merchant

Առևտրային կետի/տերմինալի նույնականացուցիչը սխալ է նշված  \(ավարտի կամ տարբեր նույնականացուցիչներով նախնական հավաստագրման համար\):

0110

Decline\. Invalid amount

Գործարքի գումարը սխալ է նշված:

0111

Decline\. No card record на Decline\. Wrong PAN

Քարտի համարը սխալ է:

0116

Decline\. Decline\. Not enough money

Գործարքի գումարը գերազանցում է ընտրված հաշվին առկա միջոցների հասանելի մնացորդը:

0120

Decline\. Not allowed

Գործառնության մերժում\. գործարքն արգելված է թողարկողի կողմից: Վճարային ցանցի պատասխանի կոդ՝ 57: Մերժման պատճառներն անհրաժեշտ է ճշտել թողարկողից:

0121

Decline\. Excds wdrwl limt

Ձեռնարկվել է թողարկող բանկի կողմից սահմանված օրական սահմանաչափը գերազանցող գումարով գործարքի իրականացման փորձ:

0123

Decline\. Excds wdrwl ltmt

Գերազանցվել է գործարքների թվի սահմանաչափը: Հաճախորդը կատարել է սահմանաչափի շրջանակներում թույլատրելի առավելագույն թվով գործարքները և փորձում է կատարել ևս մեկը:

0125

Decline\. Card declined

Քարտի համարը սխալ է: Սառեցված գումարը գերազանցող գումարի վերադարձման փորձ, զրոյական գումարի վերադարձման փորձ:

0151017

Decline\. 3DSec comm error

3\-D Secure – կապի խափանում

0151018

Decline\. Processing timeout

Թայմաուտ պրոցեսինգի ընթացքում: Չի հաջողվել ուղարկել:

0151019

Decline\. Processing timeout

Թայմաուտ պրոցեսինգի ընթացքում: Հաջողվել է ուղարկել, բայց բանկից պատասխան չի ստացվել:

02001

Decline\. Fraud

Զեղծարար գործարք \(ըստ պրոցեսինգի կամ վճարային ցանցի\):

02003

Decline\. SSL restricted

SSL \(Не 3d\-Secure/SecureCode\) գործարքներն արգելված են տվյալ առևտրային կետի համար:

02005

3DS rule failed

Վճարումը չի համապատասխանում 3ds ստուգման կանոնների պահանջներին:

0208

Decline\. Card is lost

Քարտը համարվում է կորած: 

0209

Decline\. Card limitations exceeded

Գերազանցվել են քարտի համար սահմանված սահմանափակումները:

0341014

Decline\. General Error

RBS մերժման կոդ

0341041

Decline\. Refund failed

Դրամական միջոցների վերադարձման սխալ:

05

Incorrect Parameters

Հարցման պարամետրի նշանակության սխալ:

071015

Decline\. Input error

Ներմուծվել են քարտի սխալ պարամետրեր:

08204

Decline\. Duplicate order

Նման պատվեր արդեն գրանցվել է \(ստուգում ըստ ordernumber\-ի\):

09001

RBS internal error

RBS մերժման ներքին կոդ

0902

Decline\. Invalid trans

Քարտապանը փորձում է կատարել իր համար արգելված գործարք: 

0903

Decline\. Re\-enter trans\.

Ձեռնարկվել է թողարկող բանկի կողմից սահմանված սահմանաչափը գերազանցող գործարքի փորձ:

0904

Decline\. Format error

Թողարկող բանկի տեսանկյունից հաղորդագրության սխալ ձևաչափ: 

0907

Decline\. Host not avail\.

Տվյալ քարտը թողարկած բանկի հետ կապ հաստատված չէ: Քարտի տվյալ համարի համար stand\-in ռեժիմով հավաստագրում չի թույլատրվում \(այսինքն  թողարկողը չի կարող կապ հաստատել վճարային ցանցի հետ, այդ պատճառով գործարքը հնարավոր է իրականացնել միայն offline ռեժիմով՝ այնուհետև փոխանցել Back Office\-ին, այլապես գործարքը մերժվում է\):

0909

Decline\. Call issuer

Համակարգի գործունեության ընդհանուր բնույթի սխալ, որը հայտնաբերվում է վճարային ցանցի կամ թողարկող բանկի կողմից:

0910

Decline\. Host not avail\.

Թողարկող բանկն անհասանելի է:

0913

Decline\. Invalid trans

Ցանցի տեսանկյունից սխալ ձևաչափ:

0914

Decline\. Orig trans not found

Գործարքը չի գտնվել \(երբ ուղարկվում է ավարտ, reversal կամ refund\):

0999

Declined by fraud

Բացակայում է գործարքի հավաստագրման սկիզբը: Մերժվել է զեղծարարության կամ 3dsec\. սխալի պատճառով:

02

Պատվերը մերժվել է վճարման վավերապայմաններում առկա սխալի պատճառով:

03

Incorrect Currency

Անհայտ \(արգելված\) արժույթ

04

Require parameter missed

Բացակայում է հարցման պարտադիր պարամետրը:

06

Unregistered OrderId

Չգրանցված OrderId

07

System Error

Համակարգի սխալ

20

Incorrect Username and Password

Օգտագործողի անունը կամ ծածկագիրը սխալ է:

30

Incorrect Order ID

Պատվերի նույնականացման համարը սխալ է: 

550

System Error

Համակարգի սխալ

514

Do not have Reverse operation permission

513

Do not have Refund operation permission

560

Operation failed

520

Overtime error

50

Payment sum error

510

Incorrect parameters

500

Unknown error

<a id="Table2"></a>__Աղյուսակ 2\. Վճարման կարգավիճակի նշանակությունների ցանկ __

__Վճարման կարգավիճակ__

__Պատվերի կարգավիճակի կոդ__

__Նկարագրություն__

payment\_started

0

Պատվերը գրանցվել է, բայց չի վճարվել:

payment\_approved

1

Իրականացվել է պատվերի գումարի նախնական հավաստագրում:

payment\_declined

6

Հավաստագրումը մերժվել է:

payment\_deposited

2

Իրականացվել է պատվերի գումարի հավաստագրում;

payment\_refunded

4

Գործարքի գծով իրականացվել է գումարի վերադարձի գործառնություն:

payment\_autoauthorized

5

Ձեռնարկվել է հավաստագրում թողարկող բանկի ACS միջոցով: 

payment\_void

3

Հավաստագրումը չեղարկվել է:

