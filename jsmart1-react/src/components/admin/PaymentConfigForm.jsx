import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const PaymentConfigForm = ({ config, mode, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    isActive: true,
    gatewayType: 'mpesa',
    displayName: '',
    description: '',
    displayOrder: 0,
    iconClass: '',
    mpesa: {
      businessName: '',
      businessNumber: '',
      shortCode: '',
      accountNumber: '',
      apiKey: '',
      apiSecret: '',
      passKey: '',
      callbackUrl: '',
      environment: 'sandbox',
    },
    tigopesa: {
      businessName: '',
      businessNumber: '',
      accountNumber: '',
      apiKey: '',
      apiSecret: '',
      callbackUrl: '',
      environment: 'sandbox',
    },
    airtelmoney: {
      businessName: '',
      businessNumber: '',
      accountNumber: '',
      apiKey: '',
      apiSecret: '',
      callbackUrl: '',
      environment: 'sandbox',
    },
    bank: {
      bankName: '',
      accountName: '',
      accountNumber: '',
      branchName: '',
      swiftCode: '',
      routingNumber: '',
      instructions: '',
    },
    card: {
      provider: '',
      merchantId: '',
      publicKey: '',
      privateKey: '',
      environment: 'sandbox',
    },
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Initialize form data from config if in edit mode
  useEffect(() => {
    if (mode === 'edit' && config) {
      setFormData({
        name: config.name || '',
        isActive: config.isActive !== undefined ? config.isActive : true,
        gatewayType: config.gatewayType || 'mpesa',
        displayName: config.displayName || '',
        description: config.description || '',
        displayOrder: config.displayOrder || 0,
        iconClass: config.iconClass || '',
        mpesa: {
          businessName: config.mpesa?.businessName || '',
          businessNumber: config.mpesa?.businessNumber || '',
          shortCode: config.mpesa?.shortCode || '',
          accountNumber: config.mpesa?.accountNumber || '',
          apiKey: config.mpesa?.apiKey || '',
          apiSecret: config.mpesa?.apiSecret || '',
          passKey: config.mpesa?.passKey || '',
          callbackUrl: config.mpesa?.callbackUrl || '',
          environment: config.mpesa?.environment || 'sandbox',
        },
        tigopesa: {
          businessName: config.tigopesa?.businessName || '',
          businessNumber: config.tigopesa?.businessNumber || '',
          accountNumber: config.tigopesa?.accountNumber || '',
          apiKey: config.tigopesa?.apiKey || '',
          apiSecret: config.tigopesa?.apiSecret || '',
          callbackUrl: config.tigopesa?.callbackUrl || '',
          environment: config.tigopesa?.environment || 'sandbox',
        },
        airtelmoney: {
          businessName: config.airtelmoney?.businessName || '',
          businessNumber: config.airtelmoney?.businessNumber || '',
          accountNumber: config.airtelmoney?.accountNumber || '',
          apiKey: config.airtelmoney?.apiKey || '',
          apiSecret: config.airtelmoney?.apiSecret || '',
          callbackUrl: config.airtelmoney?.callbackUrl || '',
          environment: config.airtelmoney?.environment || 'sandbox',
        },
        bank: {
          bankName: config.bank?.bankName || '',
          accountName: config.bank?.accountName || '',
          accountNumber: config.bank?.accountNumber || '',
          branchName: config.bank?.branchName || '',
          swiftCode: config.bank?.swiftCode || '',
          routingNumber: config.bank?.routingNumber || '',
          instructions: config.bank?.instructions || '',
        },
        card: {
          provider: config.card?.provider || '',
          merchantId: config.card?.merchantId || '',
          publicKey: config.card?.publicKey || '',
          privateKey: config.card?.privateKey || '',
          environment: config.card?.environment || 'sandbox',
        },
      });
    }
  }, [config, mode]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle nested object changes
  const handleNestedChange = (objectName, fieldName, value) => {
    setFormData({
      ...formData,
      [objectName]: {
        ...formData[objectName],
        [fieldName]: value,
      },
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Validate required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.gatewayType) {
      newErrors.gatewayType = 'Gateway type is required';
    }

    // Validate gateway-specific fields
    if (formData.gatewayType === 'mpesa') {
      if (!formData.mpesa.businessName.trim()) {
        newErrors['mpesa.businessName'] = 'Business name is required';
      }
      if (!formData.mpesa.businessNumber.trim()) {
        newErrors['mpesa.businessNumber'] = 'Business number is required';
      }
      // Additional validations for M-Pesa
      if (!formData.mpesa.shortCode.trim()) {
        newErrors['mpesa.shortCode'] = 'Short code is required';
      }
      if (!formData.mpesa.apiKey.trim()) {
        newErrors['mpesa.apiKey'] = 'API key is required';
      }
      if (!formData.mpesa.apiSecret.trim()) {
        newErrors['mpesa.apiSecret'] = 'API secret is required';
      }
    } else if (formData.gatewayType === 'tigopesa') {
      if (!formData.tigopesa.businessName.trim()) {
        newErrors['tigopesa.businessName'] = 'Business name is required';
      }
      if (!formData.tigopesa.businessNumber.trim()) {
        newErrors['tigopesa.businessNumber'] = 'Business number is required';
      }
      // Additional validations for Tigo Pesa
      if (!formData.tigopesa.accountNumber.trim()) {
        newErrors['tigopesa.accountNumber'] = 'Account number is required';
      }
      if (!formData.tigopesa.apiKey.trim()) {
        newErrors['tigopesa.apiKey'] = 'API key is required';
      }
      if (!formData.tigopesa.apiSecret.trim()) {
        newErrors['tigopesa.apiSecret'] = 'API secret is required';
      }
    } else if (formData.gatewayType === 'airtelmoney') {
      if (!formData.airtelmoney.businessName.trim()) {
        newErrors['airtelmoney.businessName'] = 'Business name is required';
      }
      if (!formData.airtelmoney.businessNumber.trim()) {
        newErrors['airtelmoney.businessNumber'] = 'Business number is required';
      }
      // Additional validations for Airtel Money
      if (!formData.airtelmoney.accountNumber.trim()) {
        newErrors['airtelmoney.accountNumber'] = 'Account number is required';
      }
      if (!formData.airtelmoney.apiKey.trim()) {
        newErrors['airtelmoney.apiKey'] = 'API key is required';
      }
      if (!formData.airtelmoney.apiSecret.trim()) {
        newErrors['airtelmoney.apiSecret'] = 'API secret is required';
      }
    } else if (formData.gatewayType === 'bank') {
      if (!formData.bank.bankName.trim()) {
        newErrors['bank.bankName'] = 'Bank name is required';
      }
      if (!formData.bank.accountName.trim()) {
        newErrors['bank.accountName'] = 'Account name is required';
      }
      if (!formData.bank.accountNumber.trim()) {
        newErrors['bank.accountNumber'] = 'Account number is required';
      }
      // Additional validations for Bank Account
      if (!formData.bank.branchName.trim()) {
        newErrors['bank.branchName'] = 'Branch name is required';
      }
    } else if (formData.gatewayType === 'card') {
      if (!formData.card.provider.trim()) {
        newErrors['card.provider'] = 'Provider is required';
      }
      // Additional validations for Card Payment
      if (!formData.card.merchantId.trim()) {
        newErrors['card.merchantId'] = 'Merchant ID is required';
      }
      if (!formData.card.publicKey.trim()) {
        newErrors['card.publicKey'] = 'Public key is required';
      }
      if (!formData.card.privateKey.trim()) {
        newErrors['card.privateKey'] = 'Private key is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);

      // Prepare data for submission
      const submitData = { ...formData };

      // Remove unnecessary gateway data
      Object.keys(submitData).forEach(key => {
        if (['mpesa', 'tigopesa', 'airtelmoney', 'bank', 'card'].includes(key) && key !== formData.gatewayType) {
          delete submitData[key];
        }
      });

      onSubmit(submitData);
    }
  };

  // Render gateway-specific form fields
  const renderGatewayFields = () => {
    switch (formData.gatewayType) {
      case 'mpesa':
        return (
          <div className="gateway-fields">
            <h3>M-Pesa Configuration</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="mpesa-business-name">Business Name</label>
                <input
                  type="text"
                  id="mpesa-business-name"
                  value={formData.mpesa.businessName}
                  onChange={(e) => handleNestedChange('mpesa', 'businessName', e.target.value)}
                  className={errors['mpesa.businessName'] ? 'error' : ''}
                />
                {errors['mpesa.businessName'] && <div className="error-message">{errors['mpesa.businessName']}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="mpesa-business-number">Business Number</label>
                <input
                  type="text"
                  id="mpesa-business-number"
                  value={formData.mpesa.businessNumber}
                  onChange={(e) => handleNestedChange('mpesa', 'businessNumber', e.target.value)}
                  className={errors['mpesa.businessNumber'] ? 'error' : ''}
                />
                {errors['mpesa.businessNumber'] && <div className="error-message">{errors['mpesa.businessNumber']}</div>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="mpesa-short-code">Short Code</label>
                <input
                  type="text"
                  id="mpesa-short-code"
                  value={formData.mpesa.shortCode}
                  onChange={(e) => handleNestedChange('mpesa', 'shortCode', e.target.value)}
                  className={errors['mpesa.shortCode'] ? 'error' : ''}
                />
                {errors['mpesa.shortCode'] && <div className="error-message">{errors['mpesa.shortCode']}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="mpesa-account-number">Account Number</label>
                <input
                  type="text"
                  id="mpesa-account-number"
                  value={formData.mpesa.accountNumber}
                  onChange={(e) => handleNestedChange('mpesa', 'accountNumber', e.target.value)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="mpesa-api-key">API Key</label>
                <input
                  type="text"
                  id="mpesa-api-key"
                  value={formData.mpesa.apiKey}
                  onChange={(e) => handleNestedChange('mpesa', 'apiKey', e.target.value)}
                  className={errors['mpesa.apiKey'] ? 'error' : ''}
                />
                {errors['mpesa.apiKey'] && <div className="error-message">{errors['mpesa.apiKey']}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="mpesa-api-secret">API Secret</label>
                <input
                  type="password"
                  id="mpesa-api-secret"
                  value={formData.mpesa.apiSecret}
                  onChange={(e) => handleNestedChange('mpesa', 'apiSecret', e.target.value)}
                  className={errors['mpesa.apiSecret'] ? 'error' : ''}
                />
                {errors['mpesa.apiSecret'] && <div className="error-message">{errors['mpesa.apiSecret']}</div>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="mpesa-pass-key">Pass Key</label>
                <input
                  type="password"
                  id="mpesa-pass-key"
                  value={formData.mpesa.passKey}
                  onChange={(e) => handleNestedChange('mpesa', 'passKey', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="mpesa-callback-url">Callback URL</label>
                <input
                  type="text"
                  id="mpesa-callback-url"
                  value={formData.mpesa.callbackUrl}
                  onChange={(e) => handleNestedChange('mpesa', 'callbackUrl', e.target.value)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="mpesa-environment">Environment</label>
                <select
                  id="mpesa-environment"
                  value={formData.mpesa.environment}
                  onChange={(e) => handleNestedChange('mpesa', 'environment', e.target.value)}
                >
                  <option value="sandbox">Sandbox (Testing)</option>
                  <option value="production">Production (Live)</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'tigopesa':
        return (
          <div className="gateway-fields">
            <h3>Tigo Pesa Configuration</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="tigopesa-business-name">Business Name</label>
                <input
                  type="text"
                  id="tigopesa-business-name"
                  value={formData.tigopesa.businessName}
                  onChange={(e) => handleNestedChange('tigopesa', 'businessName', e.target.value)}
                  className={errors['tigopesa.businessName'] ? 'error' : ''}
                />
                {errors['tigopesa.businessName'] && <div className="error-message">{errors['tigopesa.businessName']}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="tigopesa-business-number">Business Number</label>
                <input
                  type="text"
                  id="tigopesa-business-number"
                  value={formData.tigopesa.businessNumber}
                  onChange={(e) => handleNestedChange('tigopesa', 'businessNumber', e.target.value)}
                  className={errors['tigopesa.businessNumber'] ? 'error' : ''}
                />
                {errors['tigopesa.businessNumber'] && <div className="error-message">{errors['tigopesa.businessNumber']}</div>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="tigopesa-account-number">Account Number</label>
                <input
                  type="text"
                  id="tigopesa-account-number"
                  value={formData.tigopesa.accountNumber}
                  onChange={(e) => handleNestedChange('tigopesa', 'accountNumber', e.target.value)}
                  className={errors['tigopesa.accountNumber'] ? 'error' : ''}
                />
                {errors['tigopesa.accountNumber'] && <div className="error-message">{errors['tigopesa.accountNumber']}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="tigopesa-api-key">API Key</label>
                <input
                  type="text"
                  id="tigopesa-api-key"
                  value={formData.tigopesa.apiKey}
                  onChange={(e) => handleNestedChange('tigopesa', 'apiKey', e.target.value)}
                  className={errors['tigopesa.apiKey'] ? 'error' : ''}
                />
                {errors['tigopesa.apiKey'] && <div className="error-message">{errors['tigopesa.apiKey']}</div>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="tigopesa-api-secret">API Secret</label>
                <input
                  type="password"
                  id="tigopesa-api-secret"
                  value={formData.tigopesa.apiSecret}
                  onChange={(e) => handleNestedChange('tigopesa', 'apiSecret', e.target.value)}
                  className={errors['tigopesa.apiSecret'] ? 'error' : ''}
                />
                {errors['tigopesa.apiSecret'] && <div className="error-message">{errors['tigopesa.apiSecret']}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="tigopesa-callback-url">Callback URL</label>
                <input
                  type="text"
                  id="tigopesa-callback-url"
                  value={formData.tigopesa.callbackUrl}
                  onChange={(e) => handleNestedChange('tigopesa', 'callbackUrl', e.target.value)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="tigopesa-environment">Environment</label>
                <select
                  id="tigopesa-environment"
                  value={formData.tigopesa.environment}
                  onChange={(e) => handleNestedChange('tigopesa', 'environment', e.target.value)}
                >
                  <option value="sandbox">Sandbox (Testing)</option>
                  <option value="production">Production (Live)</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'airtelmoney':
        return (
          <div className="gateway-fields">
            <h3>Airtel Money Configuration</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="airtelmoney-business-name">Business Name</label>
                <input
                  type="text"
                  id="airtelmoney-business-name"
                  value={formData.airtelmoney.businessName}
                  onChange={(e) => handleNestedChange('airtelmoney', 'businessName', e.target.value)}
                  className={errors['airtelmoney.businessName'] ? 'error' : ''}
                />
                {errors['airtelmoney.businessName'] && <div className="error-message">{errors['airtelmoney.businessName']}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="airtelmoney-business-number">Business Number</label>
                <input
                  type="text"
                  id="airtelmoney-business-number"
                  value={formData.airtelmoney.businessNumber}
                  onChange={(e) => handleNestedChange('airtelmoney', 'businessNumber', e.target.value)}
                  className={errors['airtelmoney.businessNumber'] ? 'error' : ''}
                />
                {errors['airtelmoney.businessNumber'] && <div className="error-message">{errors['airtelmoney.businessNumber']}</div>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="airtelmoney-account-number">Account Number</label>
                <input
                  type="text"
                  id="airtelmoney-account-number"
                  value={formData.airtelmoney.accountNumber}
                  onChange={(e) => handleNestedChange('airtelmoney', 'accountNumber', e.target.value)}
                  className={errors['airtelmoney.accountNumber'] ? 'error' : ''}
                />
                {errors['airtelmoney.accountNumber'] && <div className="error-message">{errors['airtelmoney.accountNumber']}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="airtelmoney-api-key">API Key</label>
                <input
                  type="text"
                  id="airtelmoney-api-key"
                  value={formData.airtelmoney.apiKey}
                  onChange={(e) => handleNestedChange('airtelmoney', 'apiKey', e.target.value)}
                  className={errors['airtelmoney.apiKey'] ? 'error' : ''}
                />
                {errors['airtelmoney.apiKey'] && <div className="error-message">{errors['airtelmoney.apiKey']}</div>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="airtelmoney-api-secret">API Secret</label>
                <input
                  type="password"
                  id="airtelmoney-api-secret"
                  value={formData.airtelmoney.apiSecret}
                  onChange={(e) => handleNestedChange('airtelmoney', 'apiSecret', e.target.value)}
                  className={errors['airtelmoney.apiSecret'] ? 'error' : ''}
                />
                {errors['airtelmoney.apiSecret'] && <div className="error-message">{errors['airtelmoney.apiSecret']}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="airtelmoney-callback-url">Callback URL</label>
                <input
                  type="text"
                  id="airtelmoney-callback-url"
                  value={formData.airtelmoney.callbackUrl}
                  onChange={(e) => handleNestedChange('airtelmoney', 'callbackUrl', e.target.value)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="airtelmoney-environment">Environment</label>
                <select
                  id="airtelmoney-environment"
                  value={formData.airtelmoney.environment}
                  onChange={(e) => handleNestedChange('airtelmoney', 'environment', e.target.value)}
                >
                  <option value="sandbox">Sandbox (Testing)</option>
                  <option value="production">Production (Live)</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'bank':
        return (
          <div className="gateway-fields">
            <h3>Bank Account Configuration</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="bank-name">Bank Name</label>
                <input
                  type="text"
                  id="bank-name"
                  value={formData.bank.bankName}
                  onChange={(e) => handleNestedChange('bank', 'bankName', e.target.value)}
                  className={errors['bank.bankName'] ? 'error' : ''}
                />
                {errors['bank.bankName'] && <div className="error-message">{errors['bank.bankName']}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="bank-account-name">Account Name</label>
                <input
                  type="text"
                  id="bank-account-name"
                  value={formData.bank.accountName}
                  onChange={(e) => handleNestedChange('bank', 'accountName', e.target.value)}
                  className={errors['bank.accountName'] ? 'error' : ''}
                />
                {errors['bank.accountName'] && <div className="error-message">{errors['bank.accountName']}</div>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="bank-account-number">Account Number</label>
                <input
                  type="text"
                  id="bank-account-number"
                  value={formData.bank.accountNumber}
                  onChange={(e) => handleNestedChange('bank', 'accountNumber', e.target.value)}
                  className={errors['bank.accountNumber'] ? 'error' : ''}
                />
                {errors['bank.accountNumber'] && <div className="error-message">{errors['bank.accountNumber']}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="bank-branch-name">Branch Name</label>
                <input
                  type="text"
                  id="bank-branch-name"
                  value={formData.bank.branchName}
                  onChange={(e) => handleNestedChange('bank', 'branchName', e.target.value)}
                  className={errors['bank.branchName'] ? 'error' : ''}
                />
                {errors['bank.branchName'] && <div className="error-message">{errors['bank.branchName']}</div>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="bank-swift-code">Swift Code</label>
                <input
                  type="text"
                  id="bank-swift-code"
                  value={formData.bank.swiftCode}
                  onChange={(e) => handleNestedChange('bank', 'swiftCode', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="bank-routing-number">Routing Number</label>
                <input
                  type="text"
                  id="bank-routing-number"
                  value={formData.bank.routingNumber}
                  onChange={(e) => handleNestedChange('bank', 'routingNumber', e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="bank-instructions">Instructions</label>
              <textarea
                id="bank-instructions"
                value={formData.bank.instructions}
                onChange={(e) => handleNestedChange('bank', 'instructions', e.target.value)}
                rows="3"
              ></textarea>
              <small>Additional instructions for bank transfers</small>
            </div>
          </div>
        );

      case 'card':
        return (
          <div className="gateway-fields">
            <h3>Card Payment Configuration</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="card-provider">Provider</label>
                <input
                  type="text"
                  id="card-provider"
                  value={formData.card.provider}
                  onChange={(e) => handleNestedChange('card', 'provider', e.target.value)}
                  className={errors['card.provider'] ? 'error' : ''}
                />
                {errors['card.provider'] && <div className="error-message">{errors['card.provider']}</div>}
                <small>e.g., Stripe, PayPal, etc.</small>
              </div>
              <div className="form-group">
                <label htmlFor="card-merchant-id">Merchant ID</label>
                <input
                  type="text"
                  id="card-merchant-id"
                  value={formData.card.merchantId}
                  onChange={(e) => handleNestedChange('card', 'merchantId', e.target.value)}
                  className={errors['card.merchantId'] ? 'error' : ''}
                />
                {errors['card.merchantId'] && <div className="error-message">{errors['card.merchantId']}</div>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="card-public-key">Public Key</label>
                <input
                  type="text"
                  id="card-public-key"
                  value={formData.card.publicKey}
                  onChange={(e) => handleNestedChange('card', 'publicKey', e.target.value)}
                  className={errors['card.publicKey'] ? 'error' : ''}
                />
                {errors['card.publicKey'] && <div className="error-message">{errors['card.publicKey']}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="card-private-key">Private Key</label>
                <input
                  type="password"
                  id="card-private-key"
                  value={formData.card.privateKey}
                  onChange={(e) => handleNestedChange('card', 'privateKey', e.target.value)}
                  className={errors['card.privateKey'] ? 'error' : ''}
                />
                {errors['card.privateKey'] && <div className="error-message">{errors['card.privateKey']}</div>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="card-environment">Environment</label>
                <select
                  id="card-environment"
                  value={formData.card.environment}
                  onChange={(e) => handleNestedChange('card', 'environment', e.target.value)}
                >
                  <option value="sandbox">Sandbox (Testing)</option>
                  <option value="production">Production (Live)</option>
                </select>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>{mode === 'add' ? 'Add New Payment Configuration' : 'Edit Payment Configuration'}</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>General Information</h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <div className="error-message">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="gatewayType">Gateway Type</label>
              <select
                id="gatewayType"
                name="gatewayType"
                value={formData.gatewayType}
                onChange={handleChange}
                className={errors.gatewayType ? 'error' : ''}
                disabled={mode === 'edit'} // Cannot change gateway type in edit mode
              >
                <option value="mpesa">M-Pesa</option>
                <option value="tigopesa">Tigo Pesa</option>
                <option value="airtelmoney">Airtel Money</option>
                <option value="bank">Bank Account</option>
                <option value="card">Card Payment</option>
              </select>
              {errors.gatewayType && <div className="error-message">{errors.gatewayType}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="displayName">Display Name</label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
              />
              <small>Name displayed to users (defaults to configuration name if empty)</small>
            </div>

            <div className="form-group">
              <label htmlFor="displayOrder">Display Order</label>
              <input
                type="number"
                id="displayOrder"
                name="displayOrder"
                value={formData.displayOrder}
                onChange={handleChange}
              />
              <small>Lower numbers appear first</small>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="iconClass">Icon Class</label>
              <input
                type="text"
                id="iconClass"
                name="iconClass"
                value={formData.iconClass}
                onChange={handleChange}
              />
              <small>FontAwesome icon class (e.g., "fa-credit-card")</small>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                Active
              </label>
              <small>Inactive configurations will not be shown to users</small>
            </div>
          </div>
        </div>

        {/* Gateway-specific fields */}
        <div className="form-section">
          {renderGatewayFields()}
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <FontAwesomeIcon icon="spinner" spin />
                <span>Saving...</span>
              </>
            ) : (
              <span>{mode === 'add' ? 'Add Configuration' : 'Save Changes'}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentConfigForm;
