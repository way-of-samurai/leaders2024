from api.models import db, Recommendation


def save_recommendation(recommendation: Recommendation, commit: bool = True) -> Recommendation:
    recommendation = db.session.add(recommendation)
    if commit:
        db.session.commit()
    return recommendation
