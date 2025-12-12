from app.metrics import CodeQualityScore

def test_code_quality_score():
    metric = CodeQualityScore()
    preds = ["1. Step one\n2. Step two\n```python\nprint('ok')\n```"]
    res = metric.compute(preds)
    assert "code_quality_score" in res
    assert res["code_quality_score"] > 0
