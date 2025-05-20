import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import api from '../services/api';
import '../styles/Donation.css';
import '../styles/modern-donation.css';

const Give = () => {
  // Form state
  const [giftAmount, setGiftAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [giftType, setGiftType] = useState('one-time');
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [activeFaq, setActiveFaq] = useState(null);

  // Donor information
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('tithe');
  const [designation, setDesignation] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [notes, setNotes] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [donationId, setDonationId] = useState(null);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [paymentConfigs, setPaymentConfigs] = useState([]);
  const [bankDetails, setBankDetails] = useState(null);

  // Fetch branches and payment configurations
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch branches
        const branchesData = await api.branches.getAll();
        setBranches(branchesData);

        // Fetch active payment configurations
        const configsData = await api.paymentConfig.getActive();
        setPaymentConfigs(configsData);

        // Set default payment method if available
        if (configsData && configsData.length > 0) {
          // Sort by display order
          const sortedConfigs = [...configsData].sort((a, b) => a.displayOrder - b.displayOrder);

          // Set the first active payment method as default
          const defaultConfig = sortedConfigs.find(config =>
            ['mpesa', 'tigopesa', 'airtelmoney'].includes(config.gatewayType)
          );

          if (defaultConfig) {
            setPaymentMethod(defaultConfig.gatewayType);
          }
        }

        // Fetch bank account details
        const bankDetailsResponse = await api.payments.getBankDetails();
        if (bankDetailsResponse && bankDetailsResponse.success) {
          setBankDetails(bankDetailsResponse.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  const handleAmountClick = (amount) => {
    setGiftAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e) => {
    setCustomAmount(e.target.value);
    setGiftAmount('custom');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate form
      const finalAmount = giftAmount === 'custom' ? parseFloat(customAmount) : parseFloat(giftAmount);

      if (!finalAmount || isNaN(finalAmount) || finalAmount <= 0) {
        throw new Error('Please enter a valid donation amount');
      }

      if (!isAnonymous && (!firstName || !lastName || !email)) {
        throw new Error('Please provide your name and email');
      }

      if (paymentMethod === 'mpesa' || paymentMethod === 'tigopesa' || paymentMethod === 'airtelmoney') {
        if (!phone) {
          throw new Error('Please provide your phone number for mobile money payments');
        }
      }

      // Create donation record
      const donationData = {
        firstName: isAnonymous ? 'Anonymous' : firstName,
        lastName: isAnonymous ? 'Donor' : lastName,
        email: isAnonymous ? 'anonymous@example.com' : email,
        phone,
        amount: finalAmount,
        currency: 'Tsh',
        donationType: giftType,
        category,
        designation,
        paymentMethod,
        branchId: selectedBranch || null,
        notes,
        isAnonymous,
      };

      const response = await api.donations.create(donationData);

      setDonationId(response.donation._id);
      setSuccess('Donation created successfully! Please complete your payment.');
      setShowPaymentForm(true);
    } catch (err) {
      console.error('Error creating donation:', err);
      setError(err.message || 'Failed to process your donation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!phone) {
        throw new Error('Please enter your phone number to complete the payment');
      }

      if (!donationId) {
        throw new Error('Donation information is missing. Please try again.');
      }

      const finalAmount = giftAmount === 'custom' ? parseFloat(customAmount) : parseFloat(giftAmount);

      let paymentResponse;

      // Process payment based on selected method
      if (paymentMethod === 'mpesa') {
        paymentResponse = await api.payments.processMpesa({
          phone,
          amount: finalAmount,
          donationId,
        });
      } else if (paymentMethod === 'tigopesa') {
        paymentResponse = await api.payments.processTigoPesa({
          phone,
          amount: finalAmount,
          donationId,
        });
      } else if (paymentMethod === 'airtelmoney') {
        paymentResponse = await api.payments.processAirtelMoney({
          phone,
          amount: finalAmount,
          donationId,
        });
      }

      if (paymentResponse && paymentResponse.success) {
        setSuccess('Payment initiated! Please check your phone to complete the transaction.');

        // Reset form after successful payment
        setTimeout(() => {
          setGiftAmount('');
          setCustomAmount('');
          setFirstName('');
          setLastName('');
          setEmail('');
          setPhone('');
          setNotes('');
          setShowPaymentForm(false);
          setDonationId(null);
        }, 5000);
      } else {
        throw new Error(paymentResponse?.message || 'Payment processing failed. Please try again.');
      }
    } catch (err) {
      console.error('Error processing payment:', err);
      setError(err.message || 'Failed to process your payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  // Helper function to get payment method display name
  const getPaymentMethodName = (method) => {
    switch (method) {
      case 'mpesa':
        return 'M-Pesa';
      case 'tigopesa':
        return 'Tigo Pesa';
      case 'airtelmoney':
        return 'Airtel Money';
      case 'bank':
        return 'Bank Transfer';
      case 'card':
        return 'Credit/Debit Card';
      default:
        return method;
    }
  };

  return (
    <main className="donation-page">
      {/* Page Banner */}
      <section className="page-banner">
        <div className="container">
          <h2>Donation</h2>
          <p>Support the ministry and mission of our church</p>
        </div>
      </section>

      {/* Donation Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Support Our Ministry</h2>
            <div className="divider" />
          </div>
          <div className="giving-intro">
            <p>Your generous donation helps us proclaim the Gospel, disciple believers, and serve our community. Every gift makes a difference in advancing God's Kingdom through the ministries of Shekinah Presbyterian Church Tanzania.</p>
            <p>We are committed to financial integrity and transparency in all our operations. Thank you for partnering with us in this mission!</p>
          </div>

          {/* Giving Options */}
          <div className="giving-options">
            <div className="giving-form-container">
              <h3>Online Donation</h3>

              {error && (
                <div className="alert alert-danger">
                  <FontAwesomeIcon icon="exclamation-circle" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="alert alert-success">
                  <FontAwesomeIcon icon="check-circle" />
                  <span>{success}</span>
                </div>
              )}

              {!showPaymentForm ? (
                <form className="giving-form" onSubmit={handleSubmit}>
                  <div className="form-section">
                    <h4>Select Amount</h4>
                    <div className="amount-options">
                      <button
                        type="button"
                        className={giftAmount === '10000' ? 'active' : ''}
                        onClick={() => handleAmountClick('10000')}
                      >
                        Tsh 10,000
                      </button>
                      <button
                        type="button"
                        className={giftAmount === '25000' ? 'active' : ''}
                        onClick={() => handleAmountClick('25000')}
                      >
                        Tsh 25,000
                      </button>
                      <button
                        type="button"
                        className={giftAmount === '50000' ? 'active' : ''}
                        onClick={() => handleAmountClick('50000')}
                      >
                        Tsh 50,00
                      </button>
                      <button
                        type="button"
                        className={giftAmount === '100000' ? 'active' : ''}
                        onClick={() => handleAmountClick('100000')}
                      >
                        Tsh 100,000
                      </button>
                      <button
                        type="button"
                        className={giftAmount === '250000' ? 'active' : ''}
                        onClick={() => handleAmountClick('250000')}
                      >
                        Tsh 250,000
                      </button>
                      <button
                        type="button"
                        className={giftAmount === '500000' ? 'active' : ''}
                        onClick={() => handleAmountClick('500000')}
                      >
                        Tsh 500,000
                      </button>
                    </div>
                    <div className="custom-amount">
                      <label htmlFor="customAmount">Custom Amount:</label>
                      <div className="input-with-icon">
                        <span className="currency-symbol">Tsh</span>
                        <input
                          type="number"
                          id="customAmount"
                          placeholder="Enter amount"
                          value={customAmount}
                          onChange={handleCustomAmountChange}
                          min="1000"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <h4>Gift Type</h4>
                    <div className="radio-options">
                      <label className={`gift-type ${giftType === 'one-time' ? 'active' : ''}`}>
                        <input
                          type="radio"
                          name="giftType"
                          value="one-time"
                          checked={giftType === 'one-time'}
                          onChange={() => setGiftType('one-time')}
                        />
                        <span>One-Time Gift</span>
                      </label>
                      <label className={`gift-type ${giftType === 'monthly' ? 'active' : ''}`}>
                        <input
                          type="radio"
                          name="giftType"
                          value="monthly"
                          checked={giftType === 'monthly'}
                          onChange={() => setGiftType('monthly')}
                        />
                        <span>Monthly Recurring</span>
                      </label>
                    </div>
                  </div>

                  <div className="form-section">
                    <h4>Donation Category</h4>
                    <select
                      className="form-control"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    >
                      <option value="tithe">Tithe</option>
                      <option value="offering">Offering</option>
                      <option value="missions">Missions</option>
                      <option value="building">Building Fund</option>
                      <option value="charity">Charity & Outreach</option>
                      <option value="other">Other</option>
                    </select>

                    {category === 'other' && (
                      <div className="form-group mt-2">
                        <label htmlFor="designation">Designation/Purpose:</label>
                        <input
                          type="text"
                          id="designation"
                          className="form-control"
                          placeholder="Specify purpose of donation"
                          value={designation}
                          onChange={(e) => setDesignation(e.target.value)}
                        />
                      </div>
                    )}
                  </div>

                  <div className="form-section">
                    <h4>Church Branch</h4>
                    <select
                      className="form-control"
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                    >
                      <option value="">General (No specific branch)</option>
                      {branches.map(branch => (
                        <option key={branch._id} value={branch._id}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-section">
                    <h4>Your Information</h4>
                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={isAnonymous}
                          onChange={(e) => setIsAnonymous(e.target.checked)}
                        />
                        <span className="ml-2">Make this donation anonymous</span>
                      </label>
                    </div>

                    {!isAnonymous && (
                      <div className="donor-info">
                        <div className="form-row">
                          <div className="form-group">
                            <label htmlFor="firstName">First Name:</label>
                            <input
                              type="text"
                              id="firstName"
                              className="form-control"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              required={!isAnonymous}
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor="lastName">Last Name:</label>
                            <input
                              type="text"
                              id="lastName"
                              className="form-control"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              required={!isAnonymous}
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label htmlFor="email">Email:</label>
                          <input
                            type="email"
                            id="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required={!isAnonymous}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="form-section">
                    <h4>Payment Method</h4>
                    <div className="radio-options">
                      {paymentConfigs.length > 0 ? (
                        paymentConfigs
                          .filter(config => ['mpesa', 'tigopesa', 'airtelmoney'].includes(config.gatewayType))
                          .sort((a, b) => a.displayOrder - b.displayOrder)
                          .map(config => (
                            <label
                              key={config._id}
                              className={`payment-method ${paymentMethod === config.gatewayType ? 'active' : ''}`}
                            >
                              <input
                                type="radio"
                                name="paymentMethod"
                                value={config.gatewayType}
                                checked={paymentMethod === config.gatewayType}
                                onChange={() => setPaymentMethod(config.gatewayType)}
                              />
                              <FontAwesomeIcon icon={config.iconClass || "mobile-alt"} />
                              <span>{config.displayName || getPaymentMethodName(config.gatewayType)}</span>
                            </label>
                          ))
                      ) : (
                        <>
                          <label className={`payment-method ${paymentMethod === 'mpesa' ? 'active' : ''}`}>
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="mpesa"
                              checked={paymentMethod === 'mpesa'}
                              onChange={() => setPaymentMethod('mpesa')}
                            />
                            <FontAwesomeIcon icon="mobile-alt" />
                            <span>M-Pesa</span>
                          </label>
                          <label className={`payment-method ${paymentMethod === 'tigopesa' ? 'active' : ''}`}>
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="tigopesa"
                              checked={paymentMethod === 'tigopesa'}
                              onChange={() => setPaymentMethod('tigopesa')}
                            />
                            <FontAwesomeIcon icon="mobile-alt" />
                            <span>Tigo Pesa</span>
                          </label>
                          <label className={`payment-method ${paymentMethod === 'airtelmoney' ? 'active' : ''}`}>
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="airtelmoney"
                              checked={paymentMethod === 'airtelmoney'}
                              onChange={() => setPaymentMethod('airtelmoney')}
                            />
                            <FontAwesomeIcon icon="mobile-alt" />
                            <span>Airtel Money</span>
                          </label>
                        </>
                      )}
                    </div>

                    {(paymentMethod === 'mpesa' || paymentMethod === 'tigopesa' || paymentMethod === 'airtelmoney') && (
                      <div className="form-group mt-2">
                        <label htmlFor="phone">Phone Number:</label>
                        <input
                          type="tel"
                          id="phone"
                          className="form-control"
                          placeholder="e.g., 0769080629 or 255769080629"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />
                        <small className="form-text text-muted">
                          Enter your phone number registered with {getPaymentMethodName(paymentMethod)}
                        </small>
                      </div>
                    )}
                  </div>

                  <div className="form-section">
                    <h4>Additional Notes (Optional)</h4>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Any additional information about your donation"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <FontAwesomeIcon icon="spinner" spin />
                        <span>Processing...</span>
                      </>
                    ) : (
                      giftType === 'one-time' ? 'Donate Now' : 'Set Up Monthly Donation'
                    )}
                  </button>
                </form>
              ) : (
                <div className="payment-confirmation">
                  <h4>Complete Your Payment</h4>
                  <p>Please confirm your payment details below:</p>

                  <div className="payment-summary">
                    <div className="summary-item">
                      <span className="label">Amount:</span>
                      <span className="value">
                        Tsh {(giftAmount === 'custom' ? parseFloat(customAmount) : parseFloat(giftAmount)).toLocaleString()}
                      </span>
                    </div>
                    <div className="summary-item">
                      <span className="label">Payment Method:</span>
                      <span className="value">
                        {getPaymentMethodName(paymentMethod)}
                      </span>
                    </div>
                    <div className="summary-item">
                      <span className="label">Phone Number:</span>
                      <span className="value">{phone || 'Not provided'}</span>
                    </div>
                  </div>

                  <form onSubmit={handlePayment}>
                    {(paymentMethod === 'mpesa' || paymentMethod === 'tigopesa' || paymentMethod === 'airtelmoney') && (
                      <div className="form-group">
                        <label htmlFor="confirmPhone">Confirm Phone Number:</label>
                        <input
                          type="tel"
                          id="confirmPhone"
                          className="form-control"
                          placeholder="e.g., 0769080629 or 255769080629"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />
                        <small className="form-text text-muted">
                          You will receive a prompt on this phone number to complete the payment
                        </small>
                      </div>
                    )}

                    <div className="form-actions">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowPaymentForm(false)}
                        disabled={loading}
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <FontAwesomeIcon icon="spinner" spin />
                            <span>Processing Payment...</span>
                          </>
                        ) : (
                          'Complete Payment'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            <div className="other-ways">
              <h3>Other Ways to Donate</h3>
              <div className="giving-methods">
                <div className="giving-method">
                  <div className="method-icon">
                    <FontAwesomeIcon icon="church" />
                  </div>
                  <h4>In Person</h4>
                  <p>You can donate during our Sunday services or drop by the church office during the week.</p>
                </div>
                <div className="giving-method">
                  <div className="method-icon">
                    <FontAwesomeIcon icon="money-bill-wave" />
                  </div>
                  <h4>Bank Transfer</h4>
                  <p>Transfer directly to our church account:</p>
                  <div className="bank-details">
                    {bankDetails ? (
                      <>
                        <p><strong>Bank:</strong> {bankDetails.bankName || 'Tanzania National Bank'}</p>
                        <p><strong>Account Name:</strong> {bankDetails.accountName || 'Shekinah Presbyterian Church Tanzania'}</p>
                        <p><strong>Account Number:</strong> {bankDetails.accountNumber || '1234567890'}</p>
                        {bankDetails.branchName && (
                          <p><strong>Branch:</strong> {bankDetails.branchName}</p>
                        )}
                        {bankDetails.swiftCode && (
                          <p><strong>Swift Code:</strong> {bankDetails.swiftCode}</p>
                        )}
                        {bankDetails.instructions && (
                          <p><strong>Instructions:</strong> {bankDetails.instructions}</p>
                        )}
                      </>
                    ) : (
                      <>
                        <p><strong>Bank:</strong> Tanzania National Bank</p>
                        <p><strong>Account Name:</strong> Shekinah Presbyterian Church Tanzania</p>
                        <p><strong>Account Number:</strong> 1234567890</p>
                      </>
                    )}
                  </div>
                </div>
                <div className="giving-method">
                  <div className="method-icon">
                    <FontAwesomeIcon icon="mobile-alt" />
                  </div>
                  <h4>Mobile Money</h4>
                  <p>Send your contribution via mobile money:</p>
                  <div className="mobile-details">
                    {paymentConfigs.length > 0 ? (
                      paymentConfigs
                        .filter(config => ['mpesa', 'tigopesa', 'airtelmoney'].includes(config.gatewayType))
                        .sort((a, b) => a.displayOrder - b.displayOrder)
                        .map(config => {
                          const accountNumber =
                            config.gatewayType === 'mpesa' ? config.mpesa?.businessNumber :
                            config.gatewayType === 'tigopesa' ? config.tigopesa?.businessNumber :
                            config.gatewayType === 'airtelmoney' ? config.airtelmoney?.businessNumber :
                            '';

                          return (
                            <p key={config._id}>
                              <strong>{config.displayName || getPaymentMethodName(config.gatewayType)}:</strong> {accountNumber || '+255 769 080 629'}
                            </p>
                          );
                        })
                    ) : (
                      <>
                        <p><strong>M-Pesa:</strong> +255 769 080 629</p>
                        <p><strong>Tigo Pesa:</strong> +255 769 080 629</p>
                        <p><strong>Airtel Money:</strong> +255 769 080 629</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="section bg-light">
        <div className="container">
          <div className="section-header">
            <h2>Your Donation Makes a Difference</h2>
            <div className="divider" />
          </div>
          <div className="impact-grid">
            <div className="impact-card">
              <div className="impact-icon">
                <FontAwesomeIcon icon="bible" />
              </div>
              <h3>Gospel Proclamation</h3>
              <p>Your donation helps us share the Good News through church planting, evangelism, and discipleship training.</p>
            </div>
            <div className="impact-card">
              <div className="impact-icon">
                <FontAwesomeIcon icon="hands-helping" />
              </div>
              <h3>Community Outreach</h3>
              <p>We serve our community through food distribution, medical clinics, and educational support for children.</p>
            </div>
            <div className="impact-card">
              <div className="impact-icon">
                <FontAwesomeIcon icon="graduation-cap" />
              </div>
              <h3>Leadership Development</h3>
              <p>We train and equip pastors, church leaders, and missionaries to serve effectively in Tanzania and beyond.</p>
            </div>
            <div className="impact-card">
              <div className="impact-icon">
                <FontAwesomeIcon icon="church" />
              </div>
              <h3>Church Facilities</h3>
              <p>Your support helps maintain and improve our facilities for worship, fellowship, and ministry activities.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Frequently Asked Questions</h2>
            <div className="divider" />
          </div>
          <div className="faq-container">
            <div className="faq-item">
              <button
                type="button"
                className={`faq-question ${activeFaq === 0 ? 'active' : ''}`}
                onClick={() => toggleFaq(0)}
              >
                <h3>Is my donation tax-deductible?</h3>
                <span className="faq-icon">
                  <FontAwesomeIcon icon={activeFaq === 0 ? 'minus' : 'plus'} />
                </span>
              </button>
              <div className={`faq-answer ${activeFaq === 0 ? 'show' : ''}`}>
                <p>Yes, all donations to Shekinah Presbyterian Church Tanzania are tax-deductible. We provide receipts for all donations upon request.</p>
              </div>
            </div>

            <div className="faq-item">
              <button
                type="button"
                className={`faq-question ${activeFaq === 1 ? 'active' : ''}`}
                onClick={() => toggleFaq(1)}
              >
                <h3>How is my donation used?</h3>
                <span className="faq-icon">
                  <FontAwesomeIcon icon={activeFaq === 1 ? 'minus' : 'plus'} />
                </span>
              </button>
              <div className={`faq-answer ${activeFaq === 1 ? 'show' : ''}`}>
                <p>Your donation supports our church's mission, including worship services, discipleship programs, community outreach, missions, and facility maintenance.</p>
              </div>
            </div>

            <div className="faq-item">
              <button
                type="button"
                className={`faq-question ${activeFaq === 2 ? 'active' : ''}`}
                onClick={() => toggleFaq(2)}
              >
                <h3>Can I designate my donation for a specific purpose?</h3>
                <span className="faq-icon">
                  <FontAwesomeIcon icon={activeFaq === 2 ? 'minus' : 'plus'} />
                </span>
              </button>
              <div className={`faq-answer ${activeFaq === 2 ? 'show' : ''}`}>
                <p>Yes, you can designate your donation for a specific ministry or project. Please indicate your preference when making your donation.</p>
              </div>
            </div>

            <div className="faq-item">
              <button
                type="button"
                className={`faq-question ${activeFaq === 3 ? 'active' : ''}`}
                onClick={() => toggleFaq(3)}
              >
                <h3>Is online donation secure?</h3>
                <span className="faq-icon">
                  <FontAwesomeIcon icon={activeFaq === 3 ? 'minus' : 'plus'} />
                </span>
              </button>
              <div className={`faq-answer ${activeFaq === 3 ? 'show' : ''}`}>
                <p>Yes, our online donation platform uses industry-standard encryption and security protocols to protect your personal and financial information.</p>
              </div>
            </div>

            <div className="faq-item">
              <button
                type="button"
                className={`faq-question ${activeFaq === 4 ? 'active' : ''}`}
                onClick={() => toggleFaq(4)}
              >
                <h3>How can I support the mission financially?</h3>
                <span className="faq-icon">
                  <FontAwesomeIcon icon={activeFaq === 4 ? 'minus' : 'plus'} />
                </span>
              </button>
              <div className={`faq-answer ${activeFaq === 4 ? 'show' : ''}`}>
                <p>You can donate via mobile money, bank transfer, or in person. We also welcome in-kind donations such as land, Bibles, training materials, or logistics support. Details can be found on our "Support" page.</p>
              </div>
            </div>
          </div>
          <div className="faq-contact">
            <p>Have more questions about donating? <Link to="/contact">Contact us</Link> and we'll be happy to help.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <h2 className="animate-fade-in">Partner with Us in Ministry</h2>
          <p className="animate-fade-in" style={{animationDelay: '0.2s'}}>Your generosity helps advance the Kingdom of God in Tanzania and beyond</p>
          <button
            type="button"
            className="btn btn-primary btn-lg animate-slide-bottom"
            style={{animationDelay: '0.4s'}}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Donate Now <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </section>
    </main>
  );
};

export default Give;
