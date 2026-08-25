from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
from reportlab.lib.enums import TA_LEFT, TA_CENTER

GOLD  = colors.HexColor('#B8860B')
BLACK = colors.HexColor('#1A1A1A')
GREY  = colors.HexColor('#555555')
LGREY = colors.HexColor('#999999')

OUTPUT = r'C:\Users\diazc\OneDrive\Desktop\FJDMedia\Websites\Royal Kings Auto Care\Service Agreement - Royal Kings Auto Care.pdf'

doc = SimpleDocTemplate(
    OUTPUT,
    pagesize=letter,
    leftMargin=1.1*inch,
    rightMargin=1.1*inch,
    topMargin=1.0*inch,
    bottomMargin=1.0*inch,
)

def s(name, **kw):
    return ParagraphStyle(name, **kw)

S_co      = s('Co',      fontSize=16, fontName='Helvetica-Bold', textColor=BLACK,  alignment=TA_CENTER, spaceAfter=3)
S_sub     = s('Sub',     fontSize=8.5,fontName='Helvetica',      textColor=LGREY,  alignment=TA_CENTER, spaceAfter=3)
S_notice  = s('Notice',  fontSize=7.8,fontName='Helvetica-Oblique', textColor=LGREY, alignment=TA_CENTER, spaceAfter=0)
S_section = s('Section', fontSize=9,  fontName='Helvetica-Bold', textColor=GOLD,   spaceBefore=14, spaceAfter=5, textTransform='uppercase', letterSpacing=1.2)
S_svc     = s('Svc',     fontSize=9,  fontName='Helvetica-Bold', textColor=BLACK,  spaceAfter=1)
S_desc    = s('Desc',    fontSize=8.5,fontName='Helvetica',      textColor=GREY,   leading=13, spaceAfter=9)
S_bullet  = s('Bullet',  fontSize=8.5,fontName='Helvetica',      textColor=GREY,   leading=13, spaceAfter=3, leftIndent=14, firstLineIndent=-10)
S_body    = s('Body',    fontSize=8.5,fontName='Helvetica',      textColor=GREY,   leading=13, spaceAfter=6)
S_sig_lbl = s('SigLbl',  fontSize=7.5,fontName='Helvetica',      textColor=LGREY,  spaceAfter=2)
S_sig_ln  = s('SigLn',   fontSize=9,  fontName='Helvetica',      textColor=LGREY,  spaceAfter=18)

def gold_hr():
    return HRFlowable(width='100%', thickness=0.8, color=GOLD, spaceBefore=6, spaceAfter=6)

def thin_hr():
    return HRFlowable(width='100%', thickness=0.3, color=colors.HexColor('#DDDDDD'), spaceBefore=2, spaceAfter=2)

def section(text):
    return [thin_hr(), Paragraph(text, S_section)]

def svc(name, price, desc):
    return [
        Paragraph(f'{name}  —  {price}', S_svc),
        Paragraph(desc, S_desc),
    ]

def bullet(text):
    return Paragraph(f'•   {text}', S_bullet)

elems = []

# ── HEADER ──
elems += [
    Paragraph('Royal Kings Auto Care', S_co),
    Paragraph('Premium Detailing Service  ·  Winnipeg, MB', S_sub),
    Spacer(1, 6),
    gold_hr(),
    Spacer(1, 4),
    Paragraph('Service Agreement & Liability Waiver', s('DocTitle', fontSize=11, fontName='Helvetica-Bold', textColor=BLACK, alignment=TA_CENTER, spaceAfter=4)),
    Paragraph(
        'This agreement is binding whether signed digitally or on paper. Both carry equal legal weight.',
        S_notice
    ),
    Spacer(1, 6),
    gold_hr(),
]

# ── FULL SERVICE PACKAGES ──
elems += section('Full Service Packages')
elems += svc('Minimal', '$110', 'Interior vacuuming, general wipe-down and cleaning.')
elems += svc('The Standard', '$165', 'Basic deep cleaning of fabrics and surface treatment.')
elems += svc('Premium', '$195', 'Intensive fabric care, odor and stain management, and protective treatments.')
elems += [Paragraph('Vehicle Surcharges:  Coupes & Sedans +$0  ·  SUVs & Crossovers +$15  ·  Trucks & 7-Seaters +$35', S_desc)]

# ── PAINT CORRECTION ──
elems += section('Paint Correction (Buffing)')
elems += svc('1-Step Polish', '$150–$220',
    'A single-stage machine polish to remove light swirl marks, minor scratches, and oxidation. '
    'Enhances gloss and restores shine. Ideal for vehicles in fair condition that need a refresh.')
elems += svc('2-Step Correction', '$250–$350',
    'A cutting compound followed by a polishing step. Removes moderate swirls, scratches, and '
    'imperfections while improving paint clarity and depth.')
elems += svc('3-Step Correction', '$400–$600',
    'Multi-stage correction for heavily damaged paint. Aggressive cutting, refining, and finishing polish. '
    'Recommended for neglected or heavily scratched vehicles.')
elems += [Paragraph(
    'Note: Final pricing depends on paint condition, vehicle size, and time required. '
    'Full-day booking is required for most correction services.',
    S_desc
)]

# ── PROTECTION OPTIONS ──
elems += section('Protection Options')
elems += svc('Spray Ceramic Coating', '$100–$150',
    'Short-term protection (2–6 months). Enhances gloss, adds water beading, and keeps the car cleaner longer.')
elems += svc('True Ceramic Coating', '$400–$1,000+',
    'Long-term protection lasting 1–5+ years. Strong resistance against dirt, UV damage, and contaminants. '
    'Requires proper preparation and paint correction for best results.')

# ── ADD-ONS ──
elems += section('Add-On Services')
elems += svc('Clay Bar Treatment', '$50–$100',
    'Removes embedded contaminants like tar, sap, and fallout that washing alone cannot remove. '
    'Leaves the surface smooth and ready for polishing or protection.')
elems += svc('Iron Remover', '$50',
    'Dissolves iron particles and brake dust embedded in the paint and wheels, preventing long-term damage.')
elems += svc('Engine Bay Cleaning', '$50–$150',
    'Removes dirt, grease, and buildup from engine components while protecting sensitive areas.')
elems += svc('Headlight Restoration', '$60–$120',
    'Removes oxidation and haziness from headlights, restoring clarity and nighttime visibility.')
elems += svc('Pet Hair Removal', '$30–$80',
    'Removes stubborn pet hair embedded in carpets and seats using specialized tools and techniques.')
elems += svc('Stain Extraction', '$50–$150',
    'Deep extraction to remove stains, spills, and embedded dirt from seats and carpets.')
elems += svc('Odor Removal', '$50–$100',
    'Eliminates odors from smoke, pets, and spills using cleaning and deodorizing treatments.')

# ── BOOKING ──
elems += section('Booking & Mobile Service')
elems += [
    bullet('All bookings must be made at least 24 hours in advance. Same-day bookings are not accepted.'),
    bullet('Photos of the vehicle must be sent before booking to assess condition and confirm pricing.'),
    bullet('All prices are estimates and may change based on the actual condition of the vehicle upon arrival.'),
    bullet('Paint correction and ceramic coating require a full-day exclusive booking.'),
    bullet('Before and after photos are taken for documentation and protection of both parties.'),
    bullet('A travel fee of $20–$50 applies depending on distance.'),
    bullet('Customer must provide access to water and electricity unless otherwise arranged in advance.'),
]

# ── DEPOSIT ──
elems += section('Deposit & Cancellation Policy')
elems += [
    bullet('A $50 deposit is required to secure your booking. This deposit goes toward your service total.'),
    bullet('Appointments must be rescheduled at least 24 hours in advance or the deposit will be forfeited.'),
    bullet('No-shows with no prior notice will result in full forfeiture of the deposit.'),
]

# ── CUSTOMER AGREEMENT ──
elems += section('Customer Agreement & Consent')
elems += [Paragraph('By signing this agreement, the customer confirms the following:', S_body)]
elems += [
    bullet('The vehicle will be inspected before service begins and all pre-existing damage will be noted.'),
    bullet('Royal Kings Auto Care is not responsible for any pre-existing damage to the vehicle.'),
    bullet('Pricing may be adjusted based on vehicle condition upon arrival. Any changes will be communicated before work begins.'),
    bullet('The customer is responsible for removing all personal belongings from the vehicle before service.'),
    bullet('Royal Kings Auto Care is not responsible for any items left inside the vehicle.'),
    bullet('Service duration may vary depending on vehicle size and condition.'),
    bullet('Before and after photos may be used for documentation and marketing. Notify us in writing if you do not consent.'),
    bullet('The customer agrees to provide access to water and electricity for mobile service.'),
]

# ── LIABILITY ──
elems += section('Limitation of Liability')
elems += [Paragraph(
    'Royal Kings Auto Care is not liable for damage beyond what results from direct gross negligence. '
    'Detailing, paint correction, and ceramic coating carry inherent risks on vehicles with pre-existing '
    'damage, worn clear coat, or compromised paint. We reserve the right to decline or pause any service '
    'if the vehicle condition poses a risk of further damage.',
    S_desc
)]

# ── SIGNATURE ──
elems += [gold_hr(), Spacer(1, 4)]
elems += [Paragraph('Client Acknowledgment & Signature', s('SigTitle', fontSize=10, fontName='Helvetica-Bold', textColor=BLACK, spaceAfter=4))]
elems += [Paragraph(
    'By signing below, I confirm that I have read, understood, and agreed to all terms outlined in this agreement.',
    S_body
), Spacer(1, 14)]

for label in ['Customer Name', 'Vehicle (Make, Model & Year)', 'Signature', 'Date']:
    elems += [
        Paragraph(label + ':', S_sig_lbl),
        Paragraph('_' * 52, S_sig_ln),
    ]

elems += [
    gold_hr(),
    Paragraph(
        'Royal Kings Auto Care  ·  Winnipeg, MB  ·  Patrick: (431) 334-9577  ·  Justin: (431) 388-0859  ·  @RoyalKingsDetailWinnipeg',
        S_notice
    ),
]

doc.build(elems)
print('PDF generated:', OUTPUT)
