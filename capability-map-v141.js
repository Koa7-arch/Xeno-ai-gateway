// XENO v1.4.1: evidence-backed catalog associations. Not a claim of complete capability coverage.
export const CAPABILITY_TO_TOOLS = {
  "Calculator": [
    "calculate"
  ],
  "Unit conversions": [
    "convert_units"
  ],
  "Geometry and trigonometry": [
    "circle_geometry",
    "triangle_geometry",
    "pythagorean_hypotenuse"
  ],
  "Statistics and probability": [
    "statistics_summary",
    "percentile_calculator",
    "weighted_average"
  ],
  "Physics calculations": [
    "force_newton",
    "kinetic_energy",
    "momentum_calculator",
    "potential_energy"
  ],
  "Mechanical engineering formulas": [
    "torque_newton_meter",
    "mechanical_power",
    "pressure_pascal"
  ],
  "Material property calculations": [
    "density_calculator"
  ],
  "Force torque pressure and power": [
    "force_newton",
    "torque_newton_meter",
    "pressure_pascal",
    "mechanical_power"
  ],
  "Overtime and wage calculations": [
    "estimate_overtime_pay"
  ],
  "Paycheck estimates": [
    "estimate_overtime_pay"
  ],
  "Budget creation and tracking": [
    "budget_summary"
  ],
  "Expense analysis": [
    "budget_summary",
    "split_expense"
  ],
  "Savings projections": [
    "savings_projection"
  ],
  "Savings-goal timelines": [
    "goal_timeline"
  ],
  "Compound interest calculations": [
    "compound_growth"
  ],
  "Loan and mortgage calculations": [
    "loan_payment"
  ],
  "Financial scenario comparisons": [
    "simple_interest",
    "discount_price",
    "break_even_units"
  ],
  "Cash-flow projections": [
    "savings_projection",
    "budget_summary"
  ],
  "Reminders and deadlines": [
    "date_offset",
    "date_difference"
  ],
  "Daily and weekly planning": [
    "study_schedule",
    "date_offset"
  ],
  "Priority ranking": [
    "weighted_average"
  ],
  "Shift-hour calculations": [
    "work_shift_hours"
  ],
  "Overtime estimates": [
    "estimate_overtime_pay"
  ],
  "Study scheduling": [
    "study_schedule"
  ],
  "Calorie and macronutrient calculations": [
    "body_mass_index"
  ],
  "Fitness goal projections": [
    "body_mass_index",
    "percentage_change"
  ]
};
export const COMPLETE_SCOPES = new Set(["Calculator", "Compound interest calculations", "Force torque pressure and power", "Loan and mortgage calculations", "Overtime and wage calculations", "Overtime estimates", "Savings projections", "Savings-goal timelines", "Shift-hour calculations", "Unit conversions"]);
export const CAPABILITY_TOOL_CATEGORY = {
  "Calculator": "Finance",
  "Unit conversions": "Work & Field",
  "Geometry and trigonometry": "Engineering",
  "Statistics and probability": "Engineering",
  "Physics calculations": "Engineering",
  "Mechanical engineering formulas": "Engineering",
  "Material property calculations": "Engineering",
  "Force torque pressure and power": "Engineering",
  "Overtime and wage calculations": "Finance",
  "Paycheck estimates": "Finance",
  "Budget creation and tracking": "Finance",
  "Expense analysis": "Finance",
  "Savings projections": "Finance",
  "Savings-goal timelines": "Finance",
  "Compound interest calculations": "Finance",
  "Loan and mortgage calculations": "Finance",
  "Financial scenario comparisons": "Finance",
  "Cash-flow projections": "Finance",
  "Reminders and deadlines": "Organization",
  "Daily and weekly planning": "Learning",
  "Priority ranking": "Learning",
  "Shift-hour calculations": "Work & Field",
  "Overtime estimates": "Finance",
  "Study scheduling": "Learning",
  "Calorie and macronutrient calculations": "Health & Fitness",
  "Fitness goal projections": "Health & Fitness"
};
