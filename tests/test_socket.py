from app.socket import navigation


def test_navigation(app):
    with app.app_context():
        assert navigation() == {"Type 1": [0], "Type 2": [31536000, 63072000]}
