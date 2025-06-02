const allSubjects = {
  S1: [
    { name: 'Linear Algebra and Calculus', credit: 4 },
    { name: 'Engineering Physics A', credit: 4 },
    { name: 'Engineering Graphics', credit: 3 },
    { name: 'Basics of Civil & Mechanical Engineering', credit: 4 },
    { name: 'Engineering Physics Lab', credit: 1 },
    { name: 'Civil & Mechanical Workshop', credit: 1 }
  ],
  S2: [
    { name: 'Vector Calculus, Differential Equations and Transforms', credit: 4 },
    { name: 'Engineering Chemistry', credit: 4 },
    { name: 'Engineering Mechanics', credit: 3 },
    { name: 'Basics of Electrical & Electronics Engineering', credit: 4 },
    { name: 'Programming in C', credit: 4 },
    { name: 'Engineering Chemistry Lab', credit: 1 },
    { name: 'Electrical & Electronics Workshop', credit: 1 }
  ],
  S3: [
    { name: 'Discrete Mathematical Structures', credit: 4 },
    { name: 'Data Structures', credit: 4 },
    { name: 'Logic System Design', credit: 4 },
    { name: 'Object Oriented Programming Using Java', credit: 4 },
    { name: 'Professional Ethics', credit: 2 },
    { name: 'Data Structures Lab', credit: 2 },
    { name: 'OOP Lab (Java)', credit: 2 }
  ],
  S4: [
    { name: 'Graph Theory', credit: 4 },
    { name: 'Computer Organization and Architecture', credit: 4 },
    { name: 'Database Management Systems', credit: 4 },
    { name: 'Operating Systems', credit: 4 },
    { name: 'Design & Engineering', credit: 2 },
    { name: 'Digital Lab', credit: 2 },
    { name: 'Operating Systems Lab', credit: 2 }
  ]
};
const s4Btn = document.getElementById('s4Btn');
const s6Btn = document.getElementById('s6Btn');
const submitBtn = document.getElementById('submitBtn');
const subjectList = document.getElementById('subjectList');
const resultContainer = document.getElementById('result');
const resultContent = document.getElementById('resultContent');

// Start with S4 view by default
let currentSemester = 'S4';

// Switch between S4/S6 and re-render checkboxes
function switchSemester(sem) {
  currentSemester = sem;
  
  // Update button states
  if (sem === 'S4') {
    s4Btn.classList.add('btn-active');
    s4Btn.classList.remove('btn-outline');
    s4Btn.classList.add('btn-primary');
    s6Btn.classList.remove('btn-active');
    s6Btn.classList.add('btn-outline');
    s6Btn.classList.remove('btn-primary');
  } else {
    s6Btn.classList.add('btn-active');
    s6Btn.classList.remove('btn-outline');
    s6Btn.classList.add('btn-primary');
    s4Btn.classList.remove('btn-active');
    s4Btn.classList.add('btn-outline');
    s4Btn.classList.remove('btn-primary');
  }
  
  renderSubjects();
  resultContainer.style.display = 'none';
}

// Render checkboxes for the relevant previous semesters
function renderSubjects() {
  subjectList.innerHTML = '';

  // S4 students check S1 + S2; S6 students check S1 + S2 + S3 + S4
  const semestersToShow = (currentSemester === 'S4')
    ? ['S1', 'S2']
    : ['S1', 'S2', 'S3', 'S4'];

  semestersToShow.forEach(sem => {
    const semesterGroup = document.createElement('div');
    semesterGroup.className = 'semester-group';
    
    const title = document.createElement('div');
    title.className = 'semester-title';
    title.textContent = `${sem} Subjects`;
    semesterGroup.appendChild(title);
    
    allSubjects[sem].forEach((subj, index) => {
      const subjectItem = document.createElement('div');
      subjectItem.className = 'subject-item';
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'subject-checkbox';
      checkbox.name = 'backlog';
      checkbox.value = `${sem}-${index}`;
      checkbox.id = `${sem}-${index}`;
      
      const label = document.createElement('label');
      label.className = 'subject-label';
      label.htmlFor = `${sem}-${index}`;
      label.textContent = subj.name;
      
      const credit = document.createElement('span');
      credit.className = 'subject-credit';
      credit.textContent = `${subj.credit} credit${subj.credit !== 1 ? 's' : ''}`;
      
      subjectItem.appendChild(checkbox);
      subjectItem.appendChild(label);
      subjectItem.appendChild(credit);
      semesterGroup.appendChild(subjectItem);
    });
    
    subjectList.appendChild(semesterGroup);
  });
}

// On form submission, calculate credits and eligibility
submitBtn.addEventListener('click', function() {
// Find all checked checkboxes
const checkedBoxes = [...document.querySelectorAll('input[name="backlog"]:checked')];

  // Determine which semesters count toward total
const semestersToCheck = (currentSemester === 'S4')
  ? ['S1', 'S2']
  : ['S1', 'S2', 'S3', 'S4'];

  // Compute total credits from those semesters
let totalCredits = 0;
semestersToCheck.forEach(sem => {
  allSubjects[sem].forEach(subj => {
    totalCredits += subj.credit;
  });
});

// Compute backlog credits (sum of credits from checked subjects)
let backlogCredits = 0;
checkedBoxes.forEach(box => {
  const [sem, idx] = box.value.split('-');
  if (semestersToCheck.includes(sem)) {
    backlogCredits += allSubjects[sem][parseInt(idx)].credit;
  }
});

// Earned credits = totalCredits – backlogCredits
const earnedCredits = totalCredits - backlogCredits;

// Set required threshold (21 for S4, 47 for S6)
const required = (currentSemester === 'S4') ? 21 : 47;

const semRange = (currentSemester === 'S4') ? 'S1 - S2' : 'S1 - S4';
const passed = earnedCredits >= required;

const title = passed ? '✅ Eligible for Next Semester' : '❌ Not Eligible';
const text = passed
  ? 'You have met the minimum credit requirement.'
  : 'You have not met the minimum credit requirement. Year back due to insufficient credits.';

  Swal.fire({
    title: title,
    text: text,
    icon: passed ? 'success' : 'error',
    confirmButtonText: 'OK',
    confirmButtonColor: '#5f3dc4',
    html: `
      <div class="swal-details">
        <p><strong>Total Credits from ${semRange}:</strong> ${totalCredits}</p><br>
        <p><strong>Credits Required:</strong> ${required}</p><br>
        <p><strong>Earned Credits:</strong> ${earnedCredits}</p>
        <p><strong>Pending Credits:</strong> ${backlogCredits}</p>
      </div>
    `,
    didOpen: () => {
      const details = Swal.getHtmlContainer().querySelector('.swal-details');
      if (details) {
        details.style.textAlign = 'left';
        details.style.marginTop = '20px';
      }
    }
  });  
});
  // Event listeners for buttons
  s4Btn.addEventListener('click', () => switchSemester('S4'));
  s6Btn.addEventListener('click', () => switchSemester('S6'));

renderSubjects();
