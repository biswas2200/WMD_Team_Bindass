import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import apiService from '../services/api';

// Dedicated Profile Editing Page
export default function EditProfile({ user, profile, setProfile, showToast, darkMode, setPage }) {
  const { t } = useTranslation();
  const [form, setForm] = useState(() => ({ ...profile }));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({ ...profile });
  }, [profile]);

  if (!user) return <div style={wrapper}>{t('common.error', 'Error')}: Login required.</div>;

  const update = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!user.id) return showToast && showToast(t('common.error', 'Error') + ': Missing user id', 'error');
    setSaving(true);
    try {
      // Decide between patch or create
      let resp;
      if (profile && Object.keys(profile).length) {
        resp = await apiService.patchStudentProfile(user.id, form);
      } else {
        resp = await apiService.createStudentProfile(user.id, form);
      }
      let newProfile;
      if (resp?.profile || resp?.data?.profile) newProfile = resp.profile || resp.data.profile;
      else throw new Error('Invalid server response');
      // Attempt combined re-fetch to guarantee server canonical data.
      try {
        const combined = await apiService.getStudentCombined(user.id);
        if (combined?.data?.profile) newProfile = combined.data.profile;
      } catch (e) { console.warn('⚠️ Combined fetch after save failed:', e.message); }
      setProfile({ ...newProfile });
      localStorage.setItem('cc_profile', JSON.stringify(newProfile));
      showToast && showToast(t('common.success', 'Success'), 'success');
      setPage && setPage('profile');
    } catch (err) {
      showToast && showToast(t('common.error', 'Error') + ': ' + err.message, 'error');
    } finally { setSaving(false); }
  };

  const cancel = () => {
    setPage && setPage('profile');
  };

  const field = (labelKey, key, type = 'text') => (
    <label style={fieldWrap}>
      <span style={labelSpan}>{t(`profile_details.fields.${labelKey}`, labelKey)}</span>
      {type === 'textarea' ? (
        <textarea value={form[key] || ''} onChange={e => update(key, e.target.value)} style={inputStyleTextArea} />
      ) : (
        <input type={type} value={form[key] || ''} onChange={e => update(key, e.target.value)} style={inputStyle} />
      )}
    </label>
  );

  const boolToggle = (labelKey, key) => (
    <label style={boolWrap}>
      <input
        type="checkbox"
        checked={!!form[key]}
        onChange={e => update(key, e.target.checked)}
        style={{ marginRight: 6 }}
      />
      <span>{t(`profile_details.agreement_labels.${labelKey}`, labelKey)}</span>
    </label>
  );

  return (
    <div style={wrapper}>
      <h2 style={{ color: '#0077b6', marginTop: 0 }}>{t('profile_details.edit', 'Edit Profile')}</h2>
      <form onSubmit={submit} style={formGrid}>
        {field('name', 'name')}
        {field('email', 'email', 'email')}
        {field('city', 'city')}
        {field('state', 'state')}
        {field('educationLevel', 'educationLevel')}
        {field('institution', 'institutionName')}
        {field('stream', 'stream')}
        {field('phone', 'phoneNumber', 'tel')}
        {field('age', 'age', 'number')}
        {field('workPreference', 'workPreference')}
        {field('careerGoal', 'currentCareerGoal')}
        {field('aspirations', 'aspirations', 'textarea')}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: '1 / -1', marginTop: 8 }}>
          {boolToggle('terms', 'agreeToTerms')}
          {boolToggle('privacy', 'agreeToPrivacyPolicy')}
          {boolToggle('onboarding', 'onboardingCompleted')}
          {boolToggle('profile', 'profileCompleted')}
        </div>
        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 12, marginTop: 12 }}>
          <button type="submit" disabled={saving} style={saveBtn}>{saving ? t('common.loading', 'Saving...') : t('common.save', 'Save')}</button>
          <button type="button" onClick={cancel} style={cancelBtn}>{t('common.cancel', 'Cancel')}</button>
        </div>
      </form>
    </div>
  );
}

const wrapper = { maxWidth: 900, margin: '0 auto', padding: 20 };
const formGrid = { display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))' };
const fieldWrap = { display: 'flex', flexDirection: 'column', gap: 6 };
const labelSpan = { fontSize: 13, fontWeight: 600 };
const inputStyle = { padding: 10, borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 14 };
const inputStyleTextArea = { ...inputStyle, minHeight: 100, resize: 'vertical' };
const saveBtn = { padding: '10px 18px', border: 'none', borderRadius: 8, background: '#0077b6', color: '#fff', cursor: 'pointer' };
const cancelBtn = { ...saveBtn, background: '#64748b' };
const chipRow = { display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 };
const chip = { padding: '6px 10px', borderRadius: 999, border: 'none', cursor: 'pointer', fontSize: 12 };
const chipGroupWrap = { display: 'flex', flexDirection: 'column', gap: 4 };
const boolWrap = { display: 'flex', alignItems: 'center', fontSize: 14 };
