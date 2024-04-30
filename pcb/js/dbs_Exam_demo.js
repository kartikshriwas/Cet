var QText = new Array();
var A1 = new Array();
var A2 = new Array();
var A3 = new Array();
var A4 = new Array();
var C = new Array();
var Response = new Array();
var Result = new Array();
var ForReview = new Array();
var NotVisited = new Array();
var CurrentQuestion = 1;
var elapse = 1000; // this is interval - 1000 millisecond
var start = "03:00:00"; // start time
var finish = "00:00:00"; // finished time
var timer = null;
var qCnt = 10;
function onTimer(i) {
  // stop it when the function run over 5000 millisecond
  if (start == finish) {
    timer = null;
    alert("Exam time is complete!");
    // fnReview(); here comment this
    fnEnd(); // add this
    document.getElementById("btnReturn").disabled = "disabled";
    document.getElementById("clockReview").style.backgroundColor = "Red";
    document.getElementById("clockReview").innerHTML =
      "Remaining time: 00:00:00";
    return;
  }

  var hms = new String(start).split(":");
  var s = new Number(hms[2]);
  var m = new Number(hms[1]);
  var h = new Number(hms[0]);
  s -= 1;
  var totalSec = h * 3600 + m * 60 + s;

  if (s < 0) {
    s = 59;
    m -= 1;

    if (m < 0) {
      m = 59;
      h -= 1;
    }
  }

  var ss = s < 10 ? "0" + s : s;
  var sm = m < 10 ? "0" + m : m;
  var sh = h < 10 ? "0" + h : h;

  start = sh + ":" + sm + ":" + ss;
  if (getCookie("pageIndex") == "2") {
    document.getElementById("clock").innerHTML = "Remaining time: " + start;
    if (totalSec < 300)
      document.getElementById("clock").style.backgroundColor = "Red";
  } else if (getCookie("pageIndex") == "3") {
    document.getElementById("clockReview").innerHTML =
      "Remaining time: " + start;
    if (totalSec < 300)
      document.getElementById("clockReview").style.backgroundColor = "Red";
  }

  timer = window.setTimeout("onTimer()", elapse);
}

function getCookie(c_name) {
  var i,
    x,
    y,
    ARRcookies = document.cookie.split(";");
  for (i = 0; i < ARRcookies.length; i++) {
    x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
    y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
    x = x.replace(/^\s+|\s+$/g, "");
    if (x == c_name) {
      return unescape(y);
    }
  }
}

function setCookie(c_name, value, exdays) {
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + exdays);
  var c_value =
    escape(value) + (exdays == null ? "" : "; expires=" + exdate.toUTCString());
  document.cookie = c_name + "=" + c_value;
}

function eraseCookie(name) {
  setCookie(name, "", -1);
}

function loadXML() {
  if (window.XMLHttpRequest) {
    // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
  } else {
    // code for IE6, IE5
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.open("GET", "data.xml", false);
  xmlhttp.send();
  xmlDoc = xmlhttp.responseXML;

  var x = xmlDoc.getElementsByTagName("Q");
  for (i = 0; i < x.length; i++) {
    QText[i] = x[i].getElementsByTagName("QT")[0].childNodes[0].nodeValue;
    A1[i] = x[i].getElementsByTagName("O1")[0].childNodes[0].nodeValue;
    A2[i] = x[i].getElementsByTagName("O2")[0].childNodes[0].nodeValue;
    A3[i] = x[i].getElementsByTagName("O3")[0].childNodes[0].nodeValue;
    A4[i] = x[i].getElementsByTagName("O4")[0].childNodes[0].nodeValue;
    C[i] = x[i].getElementsByTagName("A")[0].childNodes[0].nodeValue;
    Response[i] = 0;
    ForReview[i] = 0;
    Result[i] = 0;
    NotVisited[i] = 1;
  }
  eraseCookie("pageIndex");
  if (
    getCookie("pageIndex") == null ||
    getCookie("pageIndex") == "" ||
    getCookie("pageIndex") == "0"
  ) {
    setCookie("pageIndex", "0", 1);
    document.getElementById("txtUserName").focus();
  } else if (getCookie("pageIndex") == "1") {
    document.getElementById("divLoginScreen").style.display = "none";
    document.getElementById("divInstructionScreen").style.display = "block";
    document.getElementById("divExamScreen").style.display = "none";
    document.getElementById("divReviewScreen").style.display = "none";
    document.getElementById("dvresult").style.display = "none";
    document.getElementById("feedback").style.display = "none";
  } else if (getCookie("pageIndex") == "2") {
    document.getElementById("divLoginScreen").style.display = "none";
    document.getElementById("divInstructionScreen").style.display = "none";
    document.getElementById("divExamScreen").style.display = "block";
    document.getElementById("divReviewScreen").style.display = "none";
    document.getElementById("dvresult").style.display = "none";
    document.getElementById("feedback").style.display = "none";
  } else if (getCookie("pageIndex") == "3") {
    document.getElementById("divLoginScreen").style.display = "none";
    document.getElementById("divInstructionScreen").style.display = "none";
    document.getElementById("divExamScreen").style.display = "none";
    document.getElementById("dvresult").style.display = "none";
    document.getElementById("divReviewScreen").style.display = "block";
    document.getElementById("feedback").style.display = "none";
  } else if (getCookie("pageIndex") == "4") {
    document.getElementById("divLoginScreen").style.display = "none";
    document.getElementById("divInstructionScreen").style.display = "none";
    document.getElementById("divExamScreen").style.display = "none";
    document.getElementById("dvresult").style.display = "block";
    document.getElementById("divReviewScreen").style.display = "none";
    document.getElementById("feedback").style.display = "none";
  } else if (getCookie("pageIndex") == "5") {
    document.getElementById("divLoginScreen").style.display = "none";
    document.getElementById("divInstructionScreen").style.display = "none";
    document.getElementById("divExamScreen").style.display = "none";
    document.getElementById("dvresult").style.display = "none";
    document.getElementById("divReviewScreen").style.display = "none";
    document.getElementById("feedback").style.display = "block";
  }
}

function fnLogin() {
  if (document.getElementById("txtUserName").value == "") {
    alert("Please enter User Name");
    document.getElementById("txtUserName").focus();
    return false;
  } else if (document.getElementById("txtPass").value == "") {
    alert("Please enter Password");
    document.getElementById("txtPass").focus();
    return false;
  }
  setCookie("pageIndex", "1", 1);
  document.getElementById("divLoginScreen").style.display = "none";
  document.getElementById("dvresult").style.display = "none";
  document.getElementById("divInstructionScreen").style.display = "block";
}

function fnLaunch() {
  if (document.getElementById("chkTerms").checked == true) {
    setCookie("pageIndex", "2", 1);
    document.getElementById("divLoginScreen").style.display = "none";
    document.getElementById("divInstructionScreen").style.display = "none";
    document.getElementById("divExamScreen").style.display = "block";
    document.getElementById("divReviewScreen").style.display = "none";
    document.getElementById("dvresult").style.display = "none";
    DisplaySectionName(1);
    displayQuestion(1);
    onTimer(); // start countdown
  } else {
    alert("Please check the checkbox on the left");
    document.getElementById("chkTerms").focus();
    return false;
  }
}

function DisplaySectionName(Qno) {
  if (Qno < qCnt+1) {
    NotVisited[Qno - 1] = 0;
    document.getElementById("divSectionName").innerHTML = "Section xxx";
    frmExam.SectionSelect.options.selectedIndex = 0;
    for (i = 1; i < qCnt+1; i++) {
      document.getElementById("Q" + i).innerHTML = i;
      document
        .getElementById("Q-IMG" + i)
        .setAttribute("src", "./Images/Rectangle_1.png");
      if (Response[i - 1] > 0)
        document
          .getElementById("Q-IMG" + i)
          .setAttribute("src", "./Images/Vector_1.png");
      if (ForReview[i - 1] > 0)
        document
          .getElementById("Q-IMG" + i)
          .setAttribute("src", "./Images/Ellipse_3.png");
      if (Response[i - 1] > 0 && ForReview[i - 1] > 0) {
        document
          .getElementById("Q-IMG" + i)
          .setAttribute("src", "./Images/Group_1.png");
      }
      if (
        Response[i - 1] == 0 &&
        ForReview[i - 1] == 0 &&
        NotVisited[i - 1] == 0
      ) {
        document
          .getElementById("Q-IMG" + i)
          .setAttribute("src", "./Images/Vector_2.png");
      }
    }
  }
  //        else if (Qno < 11) {
  //            document.getElementById('divSectionName').innerHTML = "MS Office";
  //            frmExam.SectionSelect.options.selectedIndex = 1;
  //            for (i = 1; i < 6; i++) {
  //                document.getElementById('Q' + i).innerHTML = i + 5;
  //                document.getElementById('Q' + i).style.backgroundColor = "Gray";
  //                if (Response[i + 4] > 0)
  //                    document.getElementById('Q' + i).style.backgroundColor = "Green";
  //                if (ForReview[i + 4] > 0)
  //                    document.getElementById('Q' + i).style.backgroundColor = "Blue";
  //            }
  //        }
  //        else if (Qno < 16) {
  //            document.getElementById('divSectionName').innerHTML = "Computer Communication Internet & Email";
  //            frmExam.SectionSelect.options.selectedIndex = 2;
  //            for (i = 1; i < 6; i++) {
  //                document.getElementById('Q' + i).innerHTML = i + 10;
  //                document.getElementById('Q' + i).style.backgroundColor = "Gray";
  //                if (Response[i + 9] > 0)
  //                    document.getElementById('Q' + i).style.backgroundColor = "Green";
  //                if (ForReview[i + 9] > 0)
  //                    document.getElementById('Q' + i).style.backgroundColor = "Blue";
  //            }
  //        }
  else {
    document.getElementById("divSectionName").innerHTML = "General Knowledge 2";
    frmExam.SectionSelect.options.selectedIndex = 1;
    for (i = 1; i < qCnt+1; i++) {
      document.getElementById("Q" + i).innerHTML = i + qCnt;
      document.getElementById("Q" + i).style.backgroundColor = "Gray";
      if (Response[i + (qCnt-1)] > 0)
        document.getElementById("Q" + i).style.backgroundColor = "Green";
      if (ForReview[i + (qCnt-1)] > 0)
        document.getElementById("Q" + i).style.backgroundColor = "Blue";
    }
  }
}

function displayQuestion(QNo) {
  document.getElementById("lblQNo").innerHTML = "Question " + QNo + " of " + qCnt +":";
  document.getElementById("lblQuestion").innerHTML ="<img src='" + QText[QNo - 1] + "' />";
  document.getElementById("lblOpt1").innerHTML = "<img src='" + A1[QNo - 1] + "' />";
  document.getElementById("lblOpt2").innerHTML = "<img src='" + A2[QNo - 1] + "' />";
  document.getElementById("lblOpt3").innerHTML = "<img src='" + A3[QNo - 1] + "' />";
  document.getElementById("lblOpt4").innerHTML = "<img src='" + A4[QNo - 1] + "' />";
  if (ForReview[QNo - 1] == 0)
    document.getElementById("chkReview").checked = false;
  else document.getElementById("chkReview").checked = true;

  if (QNo == 1) {
    document.getElementById("btnFirst").disabled = true;
    document.getElementById("btnPrev").disabled = true;
    document.getElementById("btnNext").disabled = false;
    document.getElementById("btnLast").disabled = false;
  } else if (QNo == qCnt) {
    document.getElementById("btnNext").disabled = true;
    document.getElementById("btnLast").disabled = true;
    document.getElementById("btnFirst").disabled = false;
    document.getElementById("btnPrev").disabled = false;
  } else if (document.getElementById("btnFirst").disabled == true) {
    document.getElementById("btnFirst").disabled = false;
    document.getElementById("btnPrev").disabled = false;
  } else if (document.getElementById("btnNext").disabled == true) {
    document.getElementById("btnNext").disabled = false;
    document.getElementById("btnLast").disabled = false;
  }
}

function fnSaveCurrentResponse() {
  var selection = frmExam.option;
  for (i = 0; i < selection.length; i++)
    if (selection[i].checked == true) {
      Response[CurrentQuestion - 1] = selection[i].value;
      if (C[CurrentQuestion - 1] == selection[i].value) {
        Result[CurrentQuestion - 1] = "1";
      }
      break;
    }
}
function CleanOptions() {
  var selection = frmExam.option;
  for (i = 0; i < 4; i++) selection[i].checked = false;
  if (Response[CurrentQuestion - 1] > 0)
    selection[Response[CurrentQuestion - 1] - 1].checked = true;
}

function manageScreen() {
  var Answred = 0,
    forReview = 0,
    notAnswered = 0,
    notVisited = 0,
    answeredAndReview = 0;
  for (i = 0; i < qCnt; i++) {
    if (Response[i] > 0 && ForReview[i] > 0) {
      answeredAndReview++;
    } else {
      if (NotVisited[i] == 0 && Response[i] == 0 && ForReview[i] == 0) {
        notAnswered++;
      } else {
        if (NotVisited[i] > 0) notVisited++;
        if (Response[i] > 0) Answred++;
        if (ForReview[i] > 0) forReview++;
      }
    }
  }
  document.getElementById("lblAnsweredAndMarkedforReview").innerHTML =
    answeredAndReview;
  document.getElementById("lblAnswred").innerHTML = Answred;
  document.getElementById("lblUnanswered").innerHTML = notAnswered;
  document.getElementById("lblMarkedforReview").innerHTML = forReview;
  document.getElementById("lblNotVisited").innerHTML = notVisited;
}

function fnFirst() {
  fnSaveCurrentResponse();
  CurrentQuestion = 1;
  DisplaySectionName(1);
  displayQuestion(1);
  manageScreen();
  CleanOptions();
}
function fnPrev() {
  fnSaveCurrentResponse();
  CurrentQuestion -= 1;
  DisplaySectionName(CurrentQuestion);
  displayQuestion(CurrentQuestion);
  manageScreen();
  CleanOptions();
}
function fnNext() {
  fnSaveCurrentResponse();
  CurrentQuestion += 1;
  DisplaySectionName(CurrentQuestion);
  displayQuestion(CurrentQuestion);
  manageScreen();
  CleanOptions();
}
function fnLast() {
  fnSaveCurrentResponse();
  CurrentQuestion = qCnt;
  DisplaySectionName(CurrentQuestion);
  displayQuestion(CurrentQuestion);
  manageScreen();
  CleanOptions();
}

function fnSelectionChange() {
  var section =
    frmExam.SectionSelect.options[frmExam.SectionSelect.options.selectedIndex]
      .value;
  fnSaveCurrentResponse();
  switch (parseInt(section)) {
    case 1:
      CurrentQuestion = 1;
      break;
    case 2:
      CurrentQuestion = qCnt+1;
      break;
    //            case 3:
    //                CurrentQuestion = 11;
    //                break;
    //            case 4:
    //                CurrentQuestion = 16;
    //                break;
  }
  DisplaySectionName(CurrentQuestion);
  displayQuestion(CurrentQuestion);
  manageScreen();
  CleanOptions();
}

function fnQuestionLabelClicked(QuestionLabel) {
  var QuestionNumber = QuestionLabel.innerHTML;
  fnSaveCurrentResponse();
  CurrentQuestion = parseInt(QuestionNumber);
  DisplaySectionName(CurrentQuestion);
  displayQuestion(CurrentQuestion);
  manageScreen();
  CleanOptions();
}

function fnReviewLabelClicked(QuestionLabel) {
  document.getElementById("divLoginScreen").style.display = "none";
  document.getElementById("divInstructionScreen").style.display = "none";
  document.getElementById("divExamScreen").style.display = "block";
  document.getElementById("divReviewScreen").style.display = "none";
  document.getElementById("dvresult").style.display = "none";
  setCookie("pageIndex", "2", 1);
  fnQuestionLabelClicked(QuestionLabel);
}

function fnMarkedReview() {
  if (document.getElementById("chkReview").checked == true) {
    ForReview[CurrentQuestion - 1] = 1;
    DisplaySectionName(CurrentQuestion);
    displayQuestion(CurrentQuestion);
    manageScreen();
    //CleanOptions();
  } else {
    ForReview[CurrentQuestion - 1] = 0;
    DisplaySectionName(CurrentQuestion);
    displayQuestion(CurrentQuestion);
    manageScreen();
    //CleanOptions();
  }
}

function fnReset() {
  var selection = frmExam.option;
  for (i = 0; i < 4; i++) selection[i].checked = false;
  Response[CurrentQuestion - 1] = 0;
  DisplaySectionName(CurrentQuestion);
  manageScreen();
}

function fnReview() {
  fnSaveCurrentResponse();
  document.getElementById("divLoginScreen").style.display = "none";
  document.getElementById("divInstructionScreen").style.display = "none";
  document.getElementById("divExamScreen").style.display = "none";
  document.getElementById("divReviewScreen").style.display = "block";
  document.getElementById("dvresult").style.display = "none";
  //document.getElementById('btnConfirmEnd').disabled = "disabled";
  setCookie("pageIndex", "3", 1);

  var Answred = 0,
    forReview = 0;
  for (i = 0; i < qCnt; i++) {
    if (Response[i] > 0) Answred++;
    if (ForReview[i] > 0) forReview++;
  }
  document.getElementById("lblAnswredReview").innerHTML = Answred;
  document.getElementById("lblUnansweredReview").innerHTML = qCnt - Answred;
  document.getElementById("lblMarkedforReviewReview").innerHTML = forReview;

  for (i = 1; i < (qCnt+1); i++) {
    document.getElementById("QR" + i).style.backgroundColor = "Gray";
    if (Response[i - 1] > 0)
      document.getElementById("QR" + i).style.backgroundColor = "Green";
    if (ForReview[i - 1] > 0)
      document.getElementById("QR" + i).style.backgroundColor = "Blue";
  }
}

function fnEnd() {
  fnSaveCurrentResponse();
  // fnReview();
  fnConfirmEnd();
}

function fnReturn() {
  document.getElementById("divLoginScreen").style.display = "none";
  document.getElementById("divInstructionScreen").style.display = "none";
  document.getElementById("divExamScreen").style.display = "block";
  document.getElementById("divReviewScreen").style.display = "none";
  document.getElementById("dvresult").style.display = "none";
  DisplaySectionName(CurrentQuestion);
  displayQuestion(CurrentQuestion);
  setCookie("pageIndex", "2", 1);
  fnConfirmEnd();
  manageScreen();
  CleanOptions();
}

function fnConfirmEnd() {
  // if (timer != null) var r = confirm("Do you really want to end exam now?");
  // else var r = true;
  // if (r == true) {
  eraseCookie("pageIndex");
  window.close();
  document.getElementById("divLoginScreen").style.display = "none";
  document.getElementById("divInstructionScreen").style.display = "none";
  document.getElementById("divExamScreen").style.display = "none";
  document.getElementById("divReviewScreen").style.display = "none";
  document.getElementById("dvresult").style.display = "block";
  document.getElementById("txtUserName").value = "";
  document.getElementById("txtPass").value = "";
  var Answred = 0,
    Correct = 0;
  for (var i = 0; i < qCnt; i++) {
    if (Response[i] > 0) Answred++;
    if (Result[i] > 0) Correct++;
  }
  document.getElementById("Q").innerHTML = qCnt;
  document.getElementById("QA").innerHTML = Answred;
  document.getElementById("QU").innerHTML = qCnt - Answred;
  // document.getElementById("S").innerHTML = Correct * 2 + " %";
  // }
}

function fnFeedback() {
  setCookie("pageIndex", "5", 1);
  document.getElementById("divLoginScreen").style.display = "none";
  document.getElementById("divInstructionScreen").style.display = "none";
  document.getElementById("divExamScreen").style.display = "none";
  document.getElementById("divReviewScreen").style.display = "none";
  document.getElementById("dvresult").style.display = "none";
  document.getElementById("feedback").style.display = "block";
  //document.getElementById('btnConfirmEnd').disabled = "disabled";
  return false;
}
