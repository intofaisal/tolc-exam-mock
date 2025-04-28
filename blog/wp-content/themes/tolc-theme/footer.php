    <footer id="colophon" class="site-footer">
        <div class="container">
            <div class="footer-widgets">
                <div class="footer-widget-area">
                    <?php if (is_active_sidebar('footer-1')) : ?>
                        <?php dynamic_sidebar('footer-1'); ?>
                    <?php else : ?>
                        <div class="footer-info">
                            <h3>TOLC Mock Test</h3>
                            <p>Free online practice platform for TOLC university entrance exams in Italy.</p>
                            <div class="social-links">
                                <a href="#" target="_blank"><i class="fab fa-facebook-f"></i></a>
                                <a href="#" target="_blank"><i class="fab fa-twitter"></i></a>
                                <a href="#" target="_blank"><i class="fab fa-instagram"></i></a>
                            </div>
                        </div>
                    <?php endif; ?>
                </div>
                
                <div class="footer-widget-area">
                    <?php if (is_active_sidebar('footer-2')) : ?>
                        <?php dynamic_sidebar('footer-2'); ?>
                    <?php else : ?>
                        <div class="footer-links">
                            <h3>Quick Links</h3>
                            <ul>
                                <li><a href="<?php echo esc_url(home_url('/')); ?>">Home</a></li>
                                <li><a href="<?php echo esc_url(home_url('/about')); ?>">About</a></li>
                                <li><a href="<?php echo esc_url(home_url('/blog')); ?>">Blog</a></li>
                                <li><a href="<?php echo esc_url(home_url('/privacy-policy')); ?>">Privacy Policy</a></li>
                                <li><a href="<?php echo esc_url(home_url('/terms-of-service')); ?>">Terms of Service</a></li>
                            </ul>
                        </div>
                    <?php endif; ?>
                </div>
                
                <div class="footer-widget-area">
                    <div class="footer-contact">
                        <h3>Contact Us</h3>
                        <p><i class="fas fa-envelope"></i> <a href="mailto:info@tolcmocktest.com">info@tolcmocktest.com</a></p>
                        <p><i class="fas fa-globe"></i> <a href="https://tolcmocktest.com">tolcmocktest.com</a></p>
                    </div>
                </div>
            </div>
            
            <div class="site-info">
                <p>&copy; <?php echo date('Y'); ?> TOLC Mock Test. All rights reserved.</p>
                <p class="footer-links">
                    <a href="<?php echo esc_url(home_url('/privacy-policy')); ?>">Privacy Policy</a> | 
                    <a href="<?php echo esc_url(home_url('/terms-of-service')); ?>">Terms of Service</a>
                </p>
            </div><!-- .site-info -->
        </div>
    </footer><!-- #colophon -->
</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>
