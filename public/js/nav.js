function switchPage(nextPage) {

  //The navigation buttons
  var btn1, btn2, bt3, bt4;
  $('#backBtn').hide(0);

  //dashbaord
  $('#classesBtn').hide(0);
  $('#studentsBtn').hide(0);
  $('#profileBtn').hide(0);
  $('#extraBtn').hide(0);

  //extra menu
  $('#newClassBtn').hide(0);
  $('#supportBtn').hide(0);
  $('#submitBtn').hide(0);
  $('#ticketsBtn').hide(0);

  //new class btn
  $('#createNewClassBtn').hide(0);

  //profile
  $('#setNameBtn').hide(0);

  //create new student view
  $('#createNewStudentBtn').hide(0);

  //All students menu
  $('#summaryBtn').hide(0);
  $('#addStudentBtn').hide(0);

  //Edit student view
  $('#positivePointBtn').hide(0);
  $('#negativePointBtn').hide(0);

  switch (nextPage) {
    case 'profile':
      $('#backBtn').show(100);
      $('#setNameBtn').show(100);
      break;
      case 'dashboard':
      $('#classesBtn').show(100);
      $('#studentsBtn').show(100);
      $('#profileBtn').show(100);
      $('#extraBtn').show(100)
        break;
        case 'classes':
        $('#backBtn').show(100);

          break;
          case 'students':
          $('#backBtn').show(100);
          $('#summaryBtn').show(100);
          $('#addStudentBtn').show(100);
            break;
            case 'allStudents':
            $('#backBtn').show(100);
            //$('#summaryBtn').show(100);
            $('#addStudentBtn').show(100);
              break;
              case 'editStudents':
              $('#backBtn').show(100);
              $('#positivePointBtn').show(100);
              $('#negativePointBtn').show(100);
                break;
                case 'newClass':
                $('#backBtn').show(100);
                $('#createNewClassBtn').show(100);

                  break;
                  case 'summary':
                  $('#backBtn').show(100);

                    break;
                  case 'newStudent':
                  $('#backBtn').show(100);
                  $('#createNewStudentBtn').show(100);

                    break;
                    case 'support':
                    $('#submitBtn').show(100);
                    $('#backBtn').show(100);

                      break;
                    case 'extra':
                    $('#backBtn').show(100);
                    if (allowed == true) {
                      $('#newClassBtn').show(100);
                    }
                    $('#supportBtn').show(100);
                    if (allowed == true) {
                      $('#ticketsBtn').show(100);
                    }

                      break;
    default:

  }

}

$( document ).ready(function() {


});
