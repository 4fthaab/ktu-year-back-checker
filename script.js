const allSubjects = {
  S1: [
    { name: 'Linear Algebra and Calculus', credit: 4 },
    { name: 'Engineering Physics A', credit: 4 },
    { name: 'Engineering Graphics', credit: 3 },
    { name: 'Basics of Civil & Mechanical Engineering', credit: 4 },
    { name: 'Life Skills', credit: 0 },
    { name: 'Engineering Physics Lab', credit: 1 },
    { name: 'Civil & Mechanical Workshop', credit: 1 }
  ],
  S2: [
    { name: 'Vector Calculus, Differential Equations and Transforms', credit: 4 },
    { name: 'Engineering Chemistry', credit: 4 },
    { name: 'Engineering Mechanics', credit: 3 },
    { name: 'Basics of Electrical & Electronics Engineering', credit: 4 },
    { name: 'Programming in C', credit: 4 },
    { name: 'Professional Communication', credit: 0 },
    { name: 'Engineering Chemistry Lab', credit: 1 },
    { name: 'Electrical & Electronics Workshop', credit: 1 }
  ],
  S3: [
    { name: 'Discrete Mathematical Structures', credit: 4 },
    { name: 'Data Structures', credit: 4 },
    { name: 'Logic System Design', credit: 4 },
    { name: 'Object Oriented Programming Using Java', credit: 4 },
    { name: 'Professional Ethics', credit: 2 },
    { name: 'Sustainable Engineering', credit: 0 },
    { name: 'Data Structures Lab', credit: 2 },
    { name: 'OOP Lab (Java)', credit: 2 }
  ],
  S4: [
    { name: 'Graph Theory', credit: 4 },
    { name: 'Computer Organization and Architecture', credit: 4 },
    { name: 'Database Management Systems', credit: 4 },
    { name: 'Operating Systems', credit: 4 },
    { name: 'Design & Engineering', credit: 2 },
    { name: 'Constitution of India', credit: 0 },
    { name: 'Digital Lab', credit: 2 },
    { name: 'Operating Systems Lab', credit: 2 }
  ]
};
const s4Btn = document.getElementById('s4Btn');
const s6Btn = document.getElementById('s6Btn');
const lateralBtn = document.getElementById('lateralBtn');
const submitBtn = document.getElementById('submitBtn');
const subjectList = document.getElementById('subjectList');
const resultContainer = document.getElementById('result');
const resultContent = document.getElementById('resultContent');

// Start with S4 view by default
let currentSemester = 'S4';

// Switch between S4/S6 and re-render checkboxes
function switchSemester(sem) {
  currentSemester = sem;

  // Reset all buttons
  [s4Btn, s6Btn, lateralBtn].forEach(btn => {
    btn.classList.remove('btn-active', 'btn-primary');
    btn.classList.add('btn-outline');
  });

  // Set active button
  if (sem === 'S4') s4Btn.classList.add('btn-active', 'btn-primary');
  else if (sem === 'S6') s6Btn.classList.add('btn-active', 'btn-primary');
  else if (sem === 'LE') lateralBtn.classList.add('btn-active', 'btn-primary');

  renderSubjects();
  resultContainer.style.display = 'none';
}

// Render checkboxes for the relevant previous semesters
function renderSubjects() {
  subjectList.innerHTML = '';

  const semestersToShow = (currentSemester === 'S4')
    ? ['S1', 'S2']
    : (currentSemester === 'S6')
    ? ['S1', 'S2', 'S3', 'S4']
    : ['S3', 'S4']; // Lateral Entry

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
      credit.textContent =`${subj.credit} credit${subj.credit > 1 ? 's' : ''}`;

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
  const checkedBoxes = [...document.querySelectorAll('input[name="backlog"]:checked')];

  const semestersToCheck = (currentSemester === 'S4')
    ? ['S1', 'S2']
    : (currentSemester === 'S6')
    ? ['S1', 'S2', 'S3', 'S4']
    : ['S3', 'S4']; // Lateral Entry

  let totalCredits = 0;
  semestersToCheck.forEach(sem => {
    allSubjects[sem].forEach(subj => {
      totalCredits += subj.credit;
    });
  });

  let backlogCredits = 0;
  checkedBoxes.forEach(box => {
    const [sem, idx] = box.value.split('-');
    if (semestersToCheck.includes(sem)) {
      backlogCredits += allSubjects[sem][parseInt(idx)].credit;
    }
  });

  const earnedCredits = totalCredits - backlogCredits;

  const required = (currentSemester === 'S4')
    ? 21
    : (currentSemester === 'S6')
    ? 47
    : 9;

  const semRange = (currentSemester === 'S4')
    ? 'S1 - S2'
    : (currentSemester === 'S6')
    ? 'S1 - S4'
    : 'S3 - S4';

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
  lateralBtn.addEventListener('click', () => switchSemester('LE'));

renderSubjects();
