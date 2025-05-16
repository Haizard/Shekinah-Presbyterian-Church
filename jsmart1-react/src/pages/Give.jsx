import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import '../styles/Give.css';
import '../styles/modern-give.css';

const Give = () => {
  const [giftAmount, setGiftAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [giftType, setGiftType] = useState('one-time');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [activeFaq, setActiveFaq] = useState(null);

  const handleAmountClick = (amount) => {
    setGiftAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e) => {
    setCustomAmount(e.target.value);
    setGiftAmount('custom');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalAmount = giftAmount === 'custom' ? customAmount : giftAmount;
    alert(`Thank you for your ${giftType} gift of $${finalAmount} via ${paymentMethod}!`);
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <main className="give-page">
      {/* Page Banner */}
      <section className="page-banner">
        <div className="container">
          <h2>Give</h2>
          <p>Support the ministry and mission of our church</p>
        </div>
      </section>

      {/* Giving Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Support Our Ministry</h2>
            <div className="divider" />
          </div>
          <div className="giving-intro">
            <p>Your generous giving helps us proclaim the Gospel, disciple believers, and serve our community. Every gift makes a difference in advancing God's Kingdom through the ministries of Shekinah Presbyterian Church Tanzania.</p>
            <p>We are committed to financial integrity and transparency in all our operations. Thank you for partnering with us in this mission!</p>
          </div>

          {/* Giving Options */}
          <div className="giving-options">
            <div className="giving-form-container">
              <h3>Online Giving</h3>
              <form className="giving-form" onSubmit={handleSubmit}>
                <div className="form-section">
                  <h4>Select Amount</h4>
                  <div className="amount-options">
                    <button
                      type="button"
                      className={giftAmount === '10' ? 'active' : ''}
                      onClick={() => handleAmountClick('10')}
                    >
                      $10
                    </button>
                    <button
                      type="button"
                      className={giftAmount === '25' ? 'active' : ''}
                      onClick={() => handleAmountClick('25')}
                    >
                      $25
                    </button>
                    <button
                      type="button"
                      className={giftAmount === '50' ? 'active' : ''}
                      onClick={() => handleAmountClick('50')}
                    >
                      $50
                    </button>
                    <button
                      type="button"
                      className={giftAmount === '100' ? 'active' : ''}
                      onClick={() => handleAmountClick('100')}
                    >
                      $100
                    </button>
                    <button
                      type="button"
                      className={giftAmount === '250' ? 'active' : ''}
                      onClick={() => handleAmountClick('250')}
                    >
                      $250
                    </button>
                    <button
                      type="button"
                      className={giftAmount === '500' ? 'active' : ''}
                      onClick={() => handleAmountClick('500')}
                    >
                      $500
                    </button>
                  </div>
                  <div className="custom-amount">
                    <label htmlFor="customAmount">Custom Amount:</label>
                    <div className="input-with-icon">
                      <span className="currency-symbol">$</span>
                      <input
                        type="number"
                        id="customAmount"
                        placeholder="Enter amount"
                        value={customAmount}
                        onChange={handleCustomAmountChange}
                        min="1"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h4>Gift Type</h4>
                  <div className="radio-options">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="giftType"
                        value="one-time"
                        checked={giftType === 'one-time'}
                        onChange={() => setGiftType('one-time')}
                      />
                      <span>One-time Gift</span>
                    </label>
                    <label className="radio-label">
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
                  <h4>Payment Method</h4>
                  <div className="payment-methods">
                    <label className={`payment-method ${paymentMethod === 'card' ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                      />
                      <FontAwesomeIcon icon={['fab', 'cc-visa']} />
                      <FontAwesomeIcon icon={['fab', 'cc-mastercard']} />
                      <span>Credit/Debit Card</span>
                    </label>
                    <label className={`payment-method ${paymentMethod === 'paypal' ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paypal"
                        checked={paymentMethod === 'paypal'}
                        onChange={() => setPaymentMethod('paypal')}
                      />
                      <FontAwesomeIcon icon={['fab', 'paypal']} />
                      <span>PayPal</span>
                    </label>
                    <label className={`payment-method ${paymentMethod === 'mobile' ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="mobile"
                        checked={paymentMethod === 'mobile'}
                        onChange={() => setPaymentMethod('mobile')}
                      />
                      <FontAwesomeIcon icon="mobile-alt" />
                      <span>Mobile Money</span>
                    </label>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-lg">
                  {giftType === 'one-time' ? 'Give Now' : 'Set Up Monthly Giving'}
                </button>
              </form>
            </div>

            <div className="other-ways">
              <h3>Other Ways to Give</h3>
              <div className="giving-methods">
                <div className="giving-method">
                  <div className="method-icon">
                    <FontAwesomeIcon icon="church" />
                  </div>
                  <h4>In Person</h4>
                  <p>You can give during our Sunday services or drop by the church office during the week.</p>
                </div>
                <div className="giving-method">
                  <div className="method-icon">
                    <FontAwesomeIcon icon="money-bill-wave" />
                  </div>
                  <h4>Bank Transfer</h4>
                  <p>Transfer directly to our church account:</p>
                  <div className="bank-details">
                    <p><strong>Bank:</strong> Tanzania National Bank</p>
                    <p><strong>Account Name:</strong> Shekinah Presbyterian Church Tanzania</p>
                    <p><strong>Account Number:</strong> 1234567890</p>
                  </div>
                </div>
                <div className="giving-method">
                  <div className="method-icon">
                    <FontAwesomeIcon icon="mobile-alt" />
                  </div>
                  <h4>Mobile Money</h4>
                  <p>Send your contribution via mobile money:</p>
                  <div className="mobile-details">
                    <p><strong>M-Pesa:</strong> +255 769 080 629</p>
                    <p><strong>Tigo Pesa:</strong> +255 769 080 629</p>
                    <p><strong>Airtel Money:</strong> +255 769 080 629</p>
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
            <h2>Your Giving Makes a Difference</h2>
            <div className="divider" />
          </div>
          <div className="impact-grid">
            <div className="impact-card">
              <div className="impact-icon">
                <FontAwesomeIcon icon="bible" />
              </div>
              <h3>Gospel Proclamation</h3>
              <p>Your giving helps us share the Good News through church planting, evangelism, and discipleship training.</p>
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
                <h3>Is my gift tax-deductible?</h3>
                <span className="faq-icon">
                  <FontAwesomeIcon icon={activeFaq === 0 ? 'minus' : 'plus'} />
                </span>
              </button>
              <div className={`faq-answer ${activeFaq === 0 ? 'show' : ''}`}>
                <p>Yes, all gifts to Shekinah Presbyterian Church Tanzania are tax-deductible. We provide receipts for all gifts upon request.</p>
              </div>
            </div>

            <div className="faq-item">
              <button
                type="button"
                className={`faq-question ${activeFaq === 1 ? 'active' : ''}`}
                onClick={() => toggleFaq(1)}
              >
                <h3>How is my gift used?</h3>
                <span className="faq-icon">
                  <FontAwesomeIcon icon={activeFaq === 1 ? 'minus' : 'plus'} />
                </span>
              </button>
              <div className={`faq-answer ${activeFaq === 1 ? 'show' : ''}`}>
                <p>Your gift supports our church's mission, including worship services, discipleship programs, community outreach, missions, and facility maintenance.</p>
              </div>
            </div>

            <div className="faq-item">
              <button
                type="button"
                className={`faq-question ${activeFaq === 2 ? 'active' : ''}`}
                onClick={() => toggleFaq(2)}
              >
                <h3>Can I designate my gift for a specific purpose?</h3>
                <span className="faq-icon">
                  <FontAwesomeIcon icon={activeFaq === 2 ? 'minus' : 'plus'} />
                </span>
              </button>
              <div className={`faq-answer ${activeFaq === 2 ? 'show' : ''}`}>
                <p>Yes, you can designate your gift for a specific ministry or project. Please indicate your preference when making your donation.</p>
              </div>
            </div>

            <div className="faq-item">
              <button
                type="button"
                className={`faq-question ${activeFaq === 3 ? 'active' : ''}`}
                onClick={() => toggleFaq(3)}
              >
                <h3>Is online giving secure?</h3>
                <span className="faq-icon">
                  <FontAwesomeIcon icon={activeFaq === 3 ? 'minus' : 'plus'} />
                </span>
              </button>
              <div className={`faq-answer ${activeFaq === 3 ? 'show' : ''}`}>
                <p>Yes, our online giving platform uses industry-standard encryption and security protocols to protect your personal and financial information.</p>
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
                <p>You can give via mobile money, bank transfer, or in person. We also welcome in-kind gifts such as land, Bibles, training materials, or logistics support. Details can be found on our "Support" page.</p>
              </div>
            </div>
          </div>
          <div className="faq-contact">
            <p>Have more questions about giving? <Link to="/contact">Contact us</Link> and we'll be happy to help.</p>
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
            Give Now <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </section>
    </main>
  );
};

export default Give;
